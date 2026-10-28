import mongoose from "mongoose";
import Inventario from "../../models/inventario.model.js";
import Cliente from "../../models/cliente.model.js";
import Ventas from "../../models/ventas.controllers.js";

export const crearVenta = async (req, res) => {
    const { cliente, productos } = req.body;

    // Validar el cliente
    if (!mongoose.isValidObjectId(cliente)) {
        return res.status(400).json({
            ok: false,
            message: "El ID del cliente no es válido."
        });
    }

    // Validar los productos
    if (!Array.isArray(productos) || productos.length === 0) {
        return res.status(400).json({
            ok: false,
            message: "La venta debe contener al menos un producto."
        });
    }

    const clienteExiste = await Cliente.findById(cliente);

    if (!clienteExiste) {
        return res.status(404).json({
            ok: false,
            message: "El cliente no existe."
        });
    }

    const productosVenta = [];
    const descuentosRealizados = [];

    let total = 0;

    try {
        // Validar y descontar el stock de cada variante
        for (const item of productos) {
            const { producto, varianteId, cantidad } = item;

            if (
                !mongoose.isValidObjectId(producto) ||
                !mongoose.isValidObjectId(varianteId) ||
                !Number.isSafeInteger(cantidad) ||
                cantidad <= 0
            ) {
                throw new Error(
                    "Los datos de un producto o su cantidad no son válidos."
                );
            }

            // Evitar cantidades duplicadas de la misma variante
            const duplicado = productosVenta.some(
                p =>
                    p.producto.toString() === producto &&
                    p.varianteId.toString() === varianteId
            );

            if (duplicado) {
                throw new Error(
                    "No repitas una variante en la venta; suma sus cantidades."
                );
            }

            const inventario = await Inventario.findOne({
                _id: producto,
                "variantes._id": varianteId
            });

            if (!inventario) {
                throw new Error(
                    `No se encontró el producto ${producto} o su variante.`
                );
            }

            const variante = inventario.variantes.id(varianteId);

            if (!variante) {
                throw new Error("No se encontró la variante seleccionada.");
            }

            // Descuento atómico: solo se descuenta si hay stock suficiente
            const actualizado = await Inventario.findOneAndUpdate(
                {
                    _id: producto,
                    variantes: {
                        $elemMatch: {
                            _id: varianteId,
                            stock: { $gte: cantidad }
                        }
                    }
                },
                {
                    $inc: {
                        "variantes.$.stock": -cantidad
                    }
                },
                {
                    new: true,
                    runValidators: true
                }
            );

            if (!actualizado) {
                throw new Error(
                    `Stock insuficiente para el producto "${inventario.nombre}".`
                );
            }

            // Guardar el descuento para poder compensarlo si algo falla
            descuentosRealizados.push({
                producto,
                varianteId,
                cantidad
            });

            const precioUnitario = variante.precio;
            const costoUnitario = variante.costo;
            const subtotal = precioUnitario * cantidad;

            if (!Number.isFinite(subtotal)) {
                throw new Error("El subtotal calculado no es válido.");
            }

            productosVenta.push({
                producto,
                varianteId,
                cantidad,
                costoUnitario,
                precioUnitario,
                subtotal
            });

            total += subtotal;
        }

        // Registrar la venta
        const venta = await Ventas.create({
            cliente,
            productos: productosVenta,
            total
        });

        return res.status(201).json({
            ok: true,
            message: "Venta registrada correctamente.",
            venta
        });

    } catch (error) {
        console.error("Error al registrar venta:", error);

        // Intentar devolver el stock descontado si la venta falla
        const erroresCompensacion = [];

        for (const descuento of descuentosRealizados.reverse()) {
            try {
                const restaurado = await Inventario.updateOne(
                    {
                        _id: descuento.producto,
                        "variantes._id": descuento.varianteId
                    },
                    {
                        $inc: {
                            "variantes.$.stock": descuento.cantidad
                        }
                    }
                );

                if (restaurado.modifiedCount !== 1) {
                    erroresCompensacion.push(descuento);
                }
            } catch (errorRestauracion) {
                erroresCompensacion.push(descuento);
                console.error(
                    "Error al restaurar stock:",
                    errorRestauracion
                );
            }
        }

        if (erroresCompensacion.length > 0) {
            console.error(
                "ATENCIÓN: no se pudo restaurar todo el stock:",
                erroresCompensacion
            );

            return res.status(500).json({
                ok: false,
                message:
                    "La venta falló y no se pudo restaurar todo el stock. Se requiere revisión manual."
            });
        }

        const mensaje = error.message || "Error al registrar la venta.";

        const esValidacion =
            mensaje.includes("no es válido") ||
            mensaje.includes("Stock insuficiente") ||
            mensaje.includes("No se encontró") ||
            mensaje.includes("No repitas") ||
            mensaje.includes("no es válido") ||
            mensaje.includes("debe contener");

        return res.status(esValidacion ? 400 : 500).json({
            ok: false,
            message: mensaje
        });
    }
};