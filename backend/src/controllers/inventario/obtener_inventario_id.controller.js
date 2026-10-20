import mongoose from "mongoose";
import Inventario from "../../models/inventario.model.js";

export const inventario_id = async (req, res)=>{
    try {
        
        const {id}= req.params;

        
        const validarId = mongoose.Types.ObjectId.isValid(id)
        if(!validarId){
            return res.status(400).json({
                ok:false,
                message:"Formato No valido del Id"
            })
        }

        const obtener_id = await Inventario.findById(id);

        if(!obtener_id){
            return res.status(404).json({
                ok:false,
                message:"No hay datos para mostrar"
            })
        }

        console.log(obtener_id)

        return res.status(200).json({
            ok:true,
            message:"los datos obtenidos son",
            obtener_id
        }) 

    } catch (error) {
        // Registrar el error en la consola del backend para facilitar su diagnóstico.
        console.error(error);

        // Devolver una respuesta genérica sin exponer detalles internos del servidor.
        return res.status(500).json({
            ok: false,
            message: "Error interno del servidor."
        });
    }
}