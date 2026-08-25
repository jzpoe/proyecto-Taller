import OrdenServicio from "../models/ordenServicio.model.js";

export const obtenerMisOrdenes = async (req, res) => {

    try {

        const tecnicoId = req.usuario.id;

        const ordenes = await OrdenServicio.find({
            tecnicoAsignado: tecnicoId
        })
            .populate("cliente")
            .populate("tecnicoAsignado", "nombre usuario rol")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            ok: true,
            ordenes
        });

    } catch (error) {

        console.error("Error al obtener las órdenes del técnico:", error);

        return res.status(500).json({
            ok: false,
            message: "Error al obtener las órdenes asignadas."
        });

    }

};