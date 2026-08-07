import mongoose, { isValidObjectId } from 'mongoose';
import Equipo from '../models/equipo.model.js';

const getEquipos = async (req, res) => {
    try {

        const equipos = await Equipo.find();
        return res.json(equipos);

    } catch (error) {
        console.error("Error al obtener los equipos:", error);
        return res.status(500).json({ message: "Error al obtener los equipos" });
    }
}

const createEquipo = async (req, res) => {
    try {
        const nuevoEquipo = new Equipo(req.body);

        if (req.file) {
            nuevoEquipo.imagen = req.file.path
        }
      
        const busquedaSerial = await Equipo.findOne({ serial: nuevoEquipo.serial });
        
        if (busquedaSerial == null) {
            await nuevoEquipo.save();
            return res.status(201).json({ message: "se ha creado exitosamente el equipo" });
        } else {
            return res.status(400).json({ message: "El equipo ingresado ya existe" });

        }
    } catch (error) {
        console.error("Error al crear el equipo:", error);
        return res.status(500).json({ message: "Error al crear el equipo" });
    }


}

const encontrarEquipoID = async (req, res) => {
    try {

        const equipoId = req.params.id
        const id_valido = mongoose.Types.ObjectId.isValid(equipoId)

        //SI id_valido ES VERDADERO, EJECUTA EL CODIGO
        if (id_valido) {
            const equipoEncontrado = await Equipo.findById(equipoId)
            if (!equipoEncontrado) {
                return res.status(404).json
                    ({ message: "equipo ingresado no se encuentra en la base de datos" })

            } else {
                return res.status(200).json(equipoEncontrado)
            }
        } else {
            return res.status(400).json
                ({ message: "Error al encontrar el ID especificado" })
        }
    } catch (err) {
        console.error("Error al crear el equipo:", err);
        return res.status(500).json({ message: "Error al encontrar" });
    }
}

const actualizarEquipo = async (req, res) => {

    try {
        const idParaActualizar = req.params.id
        const bodyParaActualizar = req.body

        //VALIDAR SI EL ID TIENE FORMATO VALIDO

        if (!mongoose.isValidObjectId(idParaActualizar)) {
            return res.status(400).json({
                message: "ID inválido"
            });
        }

        //no permitir modificar el serial
        // if (req.body.serial) {
        //     return res.status(400).json({
        //         message: "El serial no puede ser modificado"
        //     })
        // }
        //actualizar documento 
        const equipoActualizado = await Equipo.findByIdAndUpdate(
            idParaActualizar,
            bodyParaActualizar,
            { new: true }
        );

        if (!equipoActualizado) {

            return res.status(404).json
                ({ message: "equipo ingresado no se encuentra en la base de datos" })
        } else {
            return res.status(200).json(equipoActualizado)
        }
    } catch (err) {
        console.error("Error al actualizar el equipo:", err);
        return res.status(500).json({ message: "Error al encontrar" });
    }
}

const eliminarEquipo = async (req, res) => {

    try {
        const id_eliminar = req.params.id

        if (!mongoose.isValidObjectId(id_eliminar)) {
            return res.status(400).json({
                message: "ID inválido"
            });
        }

        const objeroEliminado = await Equipo.findByIdAndDelete(
            id_eliminar
        );

        return res.status(200).json({ message: "Equipo eliminado con extito" })
    } catch (err) {
        console.error("Error al eliminar el equipo:", err);
        return res.status(500).json({ message: "Error al eliminar" });
    }


}


export { getEquipos, createEquipo, encontrarEquipoID, actualizarEquipo, eliminarEquipo }; 