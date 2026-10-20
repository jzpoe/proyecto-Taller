// Importa Mongoose para validar el formato de los identificadores de MongoDB.
import mongoose from "mongoose";

// Importa el modelo Inventario para realizar operaciones en la base de datos.
import Inventario from "../../models/inventario.model.js";

// Controlador encargado de actualizar un producto del inventario mediante su ID.
export const editar_inventario = async (req, res) => {
    try {
        // Obtiene el ID del producto desde los parámetros de la URL.
        // Ejemplo: PUT /inventario/671a2b3c4d5e6f7890123456
        const { id } = req.params;

        // Obtiene los nuevos datos enviados desde el cliente en el cuerpo de la petición.
        const { nombre, categoria, variantes } = req.body;

        // Comprueba si el ID tiene un formato válido para MongoDB.
        const validarId = mongoose.Types.ObjectId.isValid(id);

        // Si el ID no tiene un formato válido, devuelve un error 400.
        if (!validarId) {
            return res.status(400).json({
                ok: false,
                message: "Formato No valido del Id"
            });
        }

        // Comprueba que el nombre y la categoría sean cadenas de texto.
        if (typeof nombre !== "string" || typeof categoria !== "string") {
            return res.status(400).json({
                ok: false,
                message: "El nombre y la categoría deben ser textos."
            });
        }

        // Elimina los espacios al inicio y al final del nombre y la categoría.
        const nombre_body = nombre.trim();
        const categoria_body = categoria.trim();

        // Comprueba que el nombre y la categoría no estén vacíos.
        if (!nombre_body || !categoria_body) {
            return res.status(400).json({
                ok: false,
                message: "No hay datos para editar"
            });
        }

        // Verifica que las variantes recibidas sean un arreglo.
        if (!Array.isArray(variantes)) {
            return res.status(400).json({
                ok: false,
                message: "Las variantes deben enviarse como un arreglo."
            });
        }


        for (const variante of variantes) {
            if (variante === null ||
                typeof variante !== "object" ||
                Array.isArray(variante) ||
                Object.keys(variante).length === 0 ||
                variante.atributos == null ||
                typeof variante.atributos !== "object" ||
                Array.isArray(variante.atributos) ||
                Object.keys(variante.atributos).length === 0 ||
                !Number.isFinite(variante.stock) ||
                variante.stock < 0
            ) {
                return res.status(400).json({
                    ok: false,
                    message: "Cada variante debe tener al menos un atributo válido."
                });

            }
            for (const [clave, valor] of Object.entries(variante.atributos)) {
                if (typeof valor !== "string" ||
                    typeof clave !== "string" ||
                    valor.trim() === "" ||
                    clave.trim() === ""
                ) {
                    return res.status(400).json({
                        ok: false,
                        message: "Cada atributo debe tener una clave y un valor de texto válido."   
                    });
                }

            }
        }
    




        // Comprueba que el arreglo contenga al menos una variante.
        if (variantes.length === 0) {
        return res.status(400).json({
            ok: false,
            message: "Debes agregar al menos una variante."
        });
    }




    // Organiza los datos que se utilizarán para actualizar el producto.
    const datosEditar = {
        nombre: nombre_body,
        categoria: categoria_body,
        variantes
    };

    // Configura Mongoose para que devuelva el documento después de actualizarlo.
    const datosNuevos = { new: true };

    // Busca el producto por su ID y actualiza los campos indicados.
    const inventario_editar = await Inventario.findByIdAndUpdate(
        id,
        datosEditar,
        datosNuevos
    );

    // Si no encuentra un producto con ese ID, devuelve un error 404.
    if (inventario_editar === null) {
        return res.status(404).json({
            ok: false,
            message: "No hay ningún producto para actualizar."
        });
    }

    // Si la actualización se realiza correctamente, devuelve el producto actualizado.
    return res.status(200).json({
        ok: true,
        message: "Producto actualizado con éxito.",
        inventario_editar
    });

} catch (error) {
    // Registra el error en la consola del servidor para facilitar su diagnóstico.
    console.error(error);

    // Devuelve una respuesta genérica si ocurre un error inesperado.
    return res.status(500).json({
        ok: false,
        message: "Error interno del servidor."
    });
}
};
