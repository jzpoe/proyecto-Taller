import Usuario from "../../models/usuario.model.js "



export const obtenerTecnicos = async (req, res) => {

    try {

        const tecnicos = await Usuario.find({
            rol: "Tecnico",
            activo: true
        })
        .select("_id nombre usuario rol")
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