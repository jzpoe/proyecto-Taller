import Equipo from "../models/equipo.model";


export const actualizarEquipo = async (req, res)=>{
    try {
        const {id} = req.params;
        const datosEquipo = req.body;

        const equipo = await Equipo.findById(id);

        if(!equipo){
            return req.status(404).json({
                ok: false,
                message :"equipo no encontrado"
            })
        }
        equipo.tipoEquipo =  datosEquipo.datosEquipo;
        equipo.serial = datosEquipo.serial;
        equipo.marca = datosEquipo.marca;
        equipo.modelo = datosEquipo.modelo;

        await equipo.save()

        return res.status(202).json({
            ok: true,
            message:"equipo actualizado con exito",
            equipo
        })


    } catch (error) {
        console.error(error);

        return res.status(500).json({

            ok: false,
            mensaje: "Error al actualizar el equipo."
        });
    }
}