import Cliente from '../models/cliente.model.js'
const crearCliente = async (req, res) => {
    try {
        const clienteBody = req.body
        const validarCedula = await Cliente.findOne({ cedula: clienteBody.cedula })
        if (validarCedula) {
            return res.status(409).json({
                message: "La cédula ya se encuentra registrada"
            })
        }
            const crearCliente = new Cliente(clienteBody);
            await crearCliente.save();
            return res.status(201).json({ message: "se ha creado exitosamente el CLIENTE" });

        

    } catch (error) {
        console.error("Error al crear el equipo:", error);
        return res.status(500).json({ message: "Error al crear el CLIENTE" });
    }
}

const obtenerClientes = async (req, res) => {
    try {

        const clientes = await Cliente.find()
        return res.json(clientes)


    } catch (error) {
        console.error("Error al obtener los clientes:", error);
        return res.status(500).json({ message: "Error al obtener los clientes" });
    }
}

export { crearCliente, obtenerClientes }