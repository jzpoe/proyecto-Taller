import mongoose, { isValidObjectId } from "mongoose"
import Equipo from '../models/equipo.model.js';
import Cliente from '../models/cliente.model.js'
import Movimiento from "../models/movimiento.model.js";



const asignacionEquipo = async (req, res) => {
    try {
        const equipoID = req.params.id

        const { cliente } = req.body

        if (!mongoose.isValidObjectId(equipoID)) {
            return res.status(400).json({
                message: "ID inválido"
            })
        }

        const validarEquipo = await Equipo.findById(equipoID)
        if (!validarEquipo) {
            return res.status(400).json({
                message: "ID ingresado no existe"
            })
        }

        if (validarEquipo.estado != "Disponible") {
            return res.status(400).json({
                message: "Equipo con estado no Disponible"
            })
        }

        const validarCliente = await Cliente.findById(cliente)
        console.log("validar el id validar cliente", validarCliente)
        if (!validarCliente) {
            return res.status(400).json({
                message: "El cliente no existe "
            })
        }

        if (validarCliente.estado != "activo") {
            console.log("validar cliente: ", validarCliente)
            return res.status(400).json({
                message: "El cliente no esta activo"
            })
        }

        validarEquipo.estado = "Asignado"
        validarEquipo.clienteActual = validarCliente._id

        await validarEquipo.save()
        

        const nuevoMovimiento = new Movimiento({
            equipo: validarEquipo._id,
            cliente: validarCliente._id,
            tipoMovimiento: "Asignacion",

        })
        console.log(nuevoMovimiento);
        await nuevoMovimiento.save();
        return res.status(200).json({
            message: "Equipo asignado exitosamente"
        })

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: error.message
        });
    }
}

export default asignacionEquipo;