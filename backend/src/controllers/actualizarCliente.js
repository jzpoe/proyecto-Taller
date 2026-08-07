import Cliente from "../models/cliente.model.js"


export const actualizarCliente = async (req, res) => {

    try {

        const { id } = req.params;
        const datosCliente= req.body;

        const cliente = await Cliente.findById(id)

        if (!cliente) {
            return res.status(404).json({
                ok: false,
                mensaje: "Cliente no encontrado."
            })
        } 
        cliente.nombre =datosCliente.nombre;
        cliente.telefono = datosCliente.telefono;
        cliente.correo = datosCliente.correo;

        await cliente.save();

        return res.status(200).json({
            ok: true,
            mensaje: "Cliente actualizado correctamente.",
            cliente
        });


    } catch (error) {
        console.error(error);

        return res.status(500).json({

            ok: false,

            mensaje: "Error al actualizar el cliente."
        });
    }


}