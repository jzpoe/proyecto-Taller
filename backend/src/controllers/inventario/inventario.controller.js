
import mongoose from "mongoose";
import Inventario from "../../models/inventario.model.js";

export const inventario = async (req, res) => {
    try {
        const { nombre, categoria, variantes, confirmarCambios = false } = req.body;

        // 1. Validar nombre y categoría.
        if (typeof nombre !== "string" || typeof categoria !== "string") {
            return res.status(400).json({
                ok: false,
                message: "El nombre y la categoría deben ser textos."
            });
        }

        const nombreVariable = nombre.trim();
        const categoriaVariable = categoria.trim();

        if (!nombreVariable || !categoriaVariable) {
            return res.status(400).json({
                ok: false,
                message: "El nombre y la categoría son obligatorios."
            });
        }

        // 2. Validar variantes.
        if (!Array.isArray(variantes) || variantes.length === 0) {
            return res.status(400).json({
                ok: false,
                message: "Debes agregar al menos una variante."
            });
        }

        // 3. Validar cada variante.
        for (const variante of variantes) {
            if (
                !variante ||
                typeof variante !== "object" ||
                Array.isArray(variante)
            ) {
                return res.status(400).json({
                    ok: false,
                    message: "Cada variante debe ser un objeto válido."
                });
            }

            if (
                typeof variante.stock !== "number" ||
                typeof variante.precio !== "number" ||
                typeof variante.costo !== "number" ||
                !Number.isFinite(variante.stock) ||
                !Number.isFinite(variante.precio) ||
                !Number.isFinite(variante.costo) ||
                !Number.isInteger(variante.stock) ||
                variante.stock < 0 ||
                variante.precio < 0 ||
                variante.costo < 0
            ) {
                return res.status(400).json({
                    ok: false,
                    message: "El stock debe ser un entero no negativo y el costo y precio deben ser números no negativos."
                });
            }

            if (
                !variante.atributos ||
                typeof variante.atributos !== "object" ||
                Array.isArray(variante.atributos) ||
                Object.keys(variante.atributos).length === 0
            ) {
                return res.status(400).json({
                    ok: false,
                    message: "Cada variante debe tener al menos un atributo."
                });
            }

            for (const [clave, valor] of Object.entries(variante.atributos)) {
                if (
                    typeof valor !== "string" ||
                    !valor.trim()
                ) {
                    return res.status(400).json({
                        ok: false,
                        message: `El atributo "${clave}" debe contener un texto válido.`
                    });
                }
            }
        }

        // 4. Buscar el producto existente sin distinguir mayúsculas.
        const productoExistente = await Inventario.findOne({
            nombre: {
                $regex: `^${nombreVariable.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
                $options: "i"
            }
        });

        // 5. Si el producto no existe, crearlo.
        if (!productoExistente) {
            const nuevoProducto = await Inventario.create({
                nombre: nombreVariable,
                categoria: categoriaVariable,
                variantes
            });

            return res.status(201).json({
                ok: true,
                message: "Producto registrado correctamente.",
                producto: nuevoProducto
            });
        }

        // 6. Comprobar que la categoría coincida.
        if (
            productoExistente.categoria.toLowerCase() !==
            categoriaVariable.toLowerCase()
        ) {
            return res.status(409).json({
                ok: false,
                message: "El producto ya existe con otra categoría.",
                categoriaExistente: productoExistente.categoria
            });
        }

        // 7. Comparar los atributos de las variantes.
        const normalizarAtributos = (atributos) => {
            const objeto = atributos instanceof Map
                ? Object.fromEntries(atributos)
                : atributos;

            return JSON.stringify(
                Object.entries(objeto || {})
                    .map(([clave, valor]) => [
                        clave.trim().toLowerCase(),
                        String(valor).trim().toLowerCase()
                    ])
                    .sort(([a], [b]) => a.localeCompare(b))
            );
        };

        const nuevasVariantes = [];
        const cambiosDetectados = [];
        const variantesExistentes = [];

        for (const varianteNueva of variantes) {
            const claveNueva = normalizarAtributos(
                varianteNueva.atributos
            );

            const varianteExistente = productoExistente.variantes.find(
                variante =>
                    normalizarAtributos(variante.atributos) === claveNueva
            );

            // Variante nueva: agregarla posteriormente.
            if (!varianteExistente) {
                nuevasVariantes.push(varianteNueva);
                continue;
            }

            variantesExistentes.push({
                varianteId: varianteExistente._id,
                atributos: varianteNueva.atributos
            });

            // Detectar diferencias de costo o precio.
            if (
                varianteExistente.costo !== varianteNueva.costo ||
                varianteExistente.precio !== varianteNueva.precio
            ) {
                cambiosDetectados.push({
                    varianteId: varianteExistente._id,
                    atributos: varianteNueva.atributos,
                    costoActual: varianteExistente.costo,
                    costoNuevo: varianteNueva.costo,
                    precioActual: varianteExistente.precio,
                    precioNuevo: varianteNueva.precio
                });
            }
        }

        // 8. Si hay cambios de precio o costo, solicitar confirmación.
        if (cambiosDetectados.length > 0 && confirmarCambios !== true) {
            return res.status(409).json({
                ok: false,
                requiereConfirmacion: true,
                message: "Se detectaron cambios en el costo o precio de variantes existentes.",
                productoId: productoExistente._id,
                cambios: cambiosDetectados
            });
        }

        // 9. Aplicar los cambios confirmados.
        // El stock existente no se reemplaza por el stock enviado.
        for (const cambio of cambiosDetectados) {
            const variante = productoExistente.variantes.id(
                cambio.varianteId
            );

            if (!variante) {
                return res.status(409).json({
                    ok: false,
                    message: "Una variante cambió mientras se procesaba la solicitud. Recarga el inventario."
                });
            }

            variante.costo = cambio.costoNuevo;
            variante.precio = cambio.precioNuevo;
        }

        // 10. Agregar solamente las variantes nuevas.
        for (const variante of nuevasVariantes) {
            productoExistente.variantes.push(variante);
        }

        await productoExistente.save();

        return res.status(200).json({
            ok: true,
            message: cambiosDetectados.length > 0
                ? "Variantes y precios actualizados correctamente."
                : nuevasVariantes.length > 0
                    ? "Se agregaron nuevas variantes al producto existente."
                    : "El producto y sus variantes ya estaban registrados.",
            producto: productoExistente,
            variantesAgregadas: nuevasVariantes.length,
            variantesActualizadas: cambiosDetectados.length
        });

    } catch (error) {
        console.error("Error al registrar inventario:", error);

        if (error instanceof mongoose.Error.ValidationError) {
            return res.status(400).json({
                ok: false,
                message: "Los datos no cumplen las validaciones del modelo."
            });
        }

        return res.status(500).json({
            ok: false,
            message: "Error interno al registrar el inventario."
        });
    }
};

