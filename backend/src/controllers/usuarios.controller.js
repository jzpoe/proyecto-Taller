import Usuario from "../models/usuario.model.js";



export const obtenerTecnicos = async (req, res) => {

    try {

        const tecnicos = await Usuario.find({
            rol: "Tecnico",
            activo: true
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
        const  id  = req.params.id;

        

        const consultar_tecnico = await Usuario.findByIdAndDelete(id)
        
        if(!consultar_tecnico){
            return res.status(404).json({
                ok:false,
                message:"No se puede encontrar el técnico solicitado"
            })
        }

        return res.status(202).json({
            ok:true,
            message:"técnico eliminado con exito",
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