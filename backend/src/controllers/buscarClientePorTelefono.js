import Cliente from "../models/cliente.model.js";



 const buscarClientePorTelefono = async (req, res) => {

    try {

        const { telefono } = req.params;

        if (!telefono) {
            return res.status(400).json({
                ok: false,
                mensaje: "Debe enviar un número de teléfono."
            });
        }

        const cliente = await Cliente.findOne({ telefono });

        if (!cliente) {
            return res.status(404).json({
                ok: false,
                cliente: null,
                mensaje: "Cliente no encontrado."
            });
        }

        return res.status(200).json({
            ok: true,
            cliente
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            ok: false,
            mensaje: "Error al buscar cliente."
        });

    }

};

export {buscarClientePorTelefono}