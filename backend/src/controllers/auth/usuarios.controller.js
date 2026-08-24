import Usuarios from "../../models/usuario.model.js "



export const obtenerUsuarios = async (req, res)=>{

    try {

        const usuarios = await Usuarios.find()
        .select("-contrasena")
        .sort({ createdAt: -1 });

        return res.status(200).json({
            ok: true,
            usuarios
        })


    } catch (error) {
        console.error("Error al obtener usuarios:", error);

        return res.status(500).json({
            ok: false,
            message: "Error al obtener los usuarios."
        });
    }

}