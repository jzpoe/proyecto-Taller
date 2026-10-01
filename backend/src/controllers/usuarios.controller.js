import Usuario from "../models/usuario.model.js";



export const obtenerTecnicos = async (req, res) => {

    try {

        const tecnicos = await Usuario.find({
            rol: "Tecnico"


        })
            .select("_id nombre usuario rol activo")
            .sort({ nombre: 1 });

        return res.status(200).json({
            ok: true,
            tecnicos
        });

    } catch (error) {

        console.error("Error al obtener técnicos:", error);

        return res.status(500).json({
            ok: false,
            message: "Error al obtener los técnicos."
        });

    }

};

export const eliminarTecnico = async (req, res) => {

    try {
        const id = req.params.id;



        const consultar_tecnico = await Usuario.findByIdAndDelete(id)

        if (!consultar_tecnico) {
            return res.status(404).json({
                ok: false,
                message: "No se puede encontrar el técnico solicitado"
            })
        }

        return res.status(202).json({
            ok: true,
            message: "técnico eliminado con exito",
            consultar_tecnico
        })



    } catch (error) {
        console.error("Error al obtener técnicos:", error);

        return res.status(500).json({
            ok: false,
            message: "Error al eliminar el técnico."
        });

    }
}



import bcrypt from "bcrypt";

export const editarTecnico = async (req, res) => {
    try {
        const { id } = req.params;
        const datos = req.body;

        const tecnico = await Usuario.findById(id);

        if (!tecnico) {
            return res.status(404).json({
                ok: false,
                message: "No se encuentra el técnico indicado."
            });
        }

        // Campos que sí se pueden editar
        tecnico.nombre = datos.nombre;
        tecnico.usuario = datos.usuario;

        // Solo cambiar contraseña si el administrador escribió una nueva
        if (datos.contrasena) {
            tecnico.contrasena = await bcrypt.hash(
                datos.contrasena,
                10
            );
        }

        // rol y activo NO se modifican aquí
        await tecnico.save();

        return res.status(200).json({
            ok: true,
            mensaje: "Técnico actualizado correctamente.",
            tecnico: {
                _id: tecnico._id,
                nombre: tecnico.nombre,
                usuario: tecnico.usuario,
                rol: tecnico.rol,
                activo: tecnico.activo
            }
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            ok: false,
            mensaje: "Error al actualizar el técnico."
        });
    }
};