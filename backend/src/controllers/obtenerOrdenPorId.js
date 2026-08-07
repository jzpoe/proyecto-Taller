import OrdenServicio from "../models/ordenServicio.model.js";


const obtenerOrdenPorId = async (req, res) => {

    try {
        const id = req.params.id

        const ordenServicio = await OrdenServicio.findById(id).populate('cliente')

        if (!ordenServicio) {
            return res.status(404).json({message:"Orden de servicio no encontrada"});
        }

        return res.json({
            ok: true,
            ordenServicio});


    } catch (error) {
        console.error("Error al encontrar el Id:", error);
        return res.status(500).json({ message: "Error adel servidor" });
    }

}

export { obtenerOrdenPorId };