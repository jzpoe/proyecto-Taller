import Inventario from "../../models/inventario.model.js"


export const obtener_inventario = async (req, res)=>{
    try {

        const obtenerInventario = await Inventario.find();

        if(obtenerInventario.length === 0){
            return res.status(200).json({
                ok:false,
                message:"No datos para mostrar"
            })
        }

        return res.status(200).json({
            ok:true,
            message:"los datos obtenidos son",
            obtenerInventario
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