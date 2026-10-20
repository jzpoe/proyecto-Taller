import Inventario from "../../models/inventario.model.js";

export const inventario = async (req, res) => {
    try {
        // Extraemos los datos enviados desde el frontend en el cuerpo de la petición.
        const { nombre, categoria, variantes } = req.body;
        

        // 1. Validar que el nombre y la categoría sean textos.
        // typeof permite comprobar el tipo de dato recibido.
        if (typeof nombre !== "string" || typeof categoria !== "string") {
            return res.status(400).json({
                ok: false,
                message: "El nombre y la categoría deben ser textos."
            });
        }

        // 2. Eliminar los espacios al principio y al final de ambos textos.
        // Esto evita guardar valores como "  Memoria RAM  ".
        const nombreVariable = nombre.trim();
        const categoriaVariable = categoria.trim();

        // 3. Comprobar que el nombre y la categoría no estén vacíos.
        // Si alguno queda vacío después de utilizar trim(), rechazamos la petición.
        if (!nombreVariable || !categoriaVariable) {
            return res.status(400).json({
                ok: false,
                message: "El nombre y la categoría son obligatorios."
            });
        }

        // 4. Comprobar que variantes exista y sea un arreglo.
        // Array.isArray() devuelve true si el valor recibido es un arreglo.
        if (!Array.isArray(variantes)) {
            return res.status(400).json({
                ok: false,
                message: "Las variantes deben enviarse como un arreglo."
            });
        }

        // 5. Comprobar que el arreglo contenga al menos una variante.
        // length indica cuántos elementos contiene el arreglo.
        if (variantes.length === 0) {
            return res.status(400).json({
                ok: false,
                message: "Debes agregar al menos una variante."
            });
        }

        // 6. Recorrer cada variante para validar su estructura, stock y atributos.
        // En cada iteración, 'variante' representa un elemento del arreglo.
        for (const variante of variantes) {

            // 6.1. Comprobar que cada variante sea un objeto válido.
            // Evitamos acceder a propiedades de null o aceptar arreglos como variantes.
            if (
                variante === null ||
                typeof variante !== "object" ||
                Array.isArray(variante)
            ) {
                return res.status(400).json({
                    ok: false,
                    message: "Cada variante debe ser un objeto válido."
                });
            }

            // 6.2. Validar el stock.
            // Debe ser un número finito y no puede ser negativo.
            // Se permite el valor 0 porque una variante puede quedarse sin existencias.
            if (
                typeof variante.stock !== "number" ||
                typeof variante.precio !== "number" ||
                !Number.isFinite(variante.stock) ||
                !Number.isFinite(variante.precio)  ||
                 variante.precio < 0  ||
                variante.stock < 0
            ) {
                return res.status(400).json({
                    ok: false,
                    message: "El stock y precio debe ser un número válido mayor o igual a cero."
                });
            }

            // 6.3. Comprobar que los atributos sean un objeto y que no esté vacío.
            // Object.keys() obtiene las propiedades del objeto.
            // length cuenta cuántas propiedades existen.
            if (
                !variante.atributos ||
                typeof variante.atributos !== "object" ||
                Array.isArray(variante.atributos) ||
                Object.keys(variante.atributos).length === 0
            ) {
                return res.status(400).json({
                    ok: false,
                    message: "Cada variante debe tener al menos un atributo válido."
                });
            }

            // 6.4. Recorrer los atributos de la variante para validar sus valores.
            // Object.entries() convierte las propiedades en pares [clave, valor].
            for (const [clave, valor] of Object.entries(variante.atributos)) {

                // Cada valor debe ser un texto y contener información.
                // trim() elimina espacios; si el resultado queda vacío, lo rechazamos.
                if (
                    typeof clave !== "string" ||
                    typeof valor !== "string" ||
                    valor.trim() === ""

                ) {
                    return res.status(400).json({
                        ok: false,
                        message: `El atributo "${clave}" debe contener un texto válido.`
                    });
                }
            }
        }

        const datosVariables =  {
                nombre:nombreVariable,
                categoria:categoriaVariable,
                variantes
        }

        const datosDeVariables = await Inventario.create(datosVariables );

        // 7. Si todas las validaciones pasan, respondemos que los datos son válidos.
        // Por ahora no estamos guardando el producto en MongoDB.
        return res.status(201).json({
            ok: true,
            message: "Producto registrado correctamente.",
            datosDeVariables
        });

    } catch (error) {

        // Registrar el error en la consola del backend para facilitar su diagnóstico.
        console.error(error);

        // Devolver una respuesta genérica sin exponer detalles internos del servidor.
        return res.status(500).json({
            ok: false,
            message: "Error interno del servidor."
        });
    }
};