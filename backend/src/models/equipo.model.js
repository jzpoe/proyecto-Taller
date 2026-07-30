import mongoose from "mongoose";


const equipoSchema = new mongoose.Schema({

    clienteActual: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cliente",
        default: null
    },
    // fechaAsignacion:{
    //     type:Date,
    //     default:null
    // },
    serial: {
        type: String,
        required: true,
        unique: true
    },
    tipoEquipo: {
        type: String,
        required: true
    },
    marca: {
        type: String,
        required: true
    },
    modelo: {
        type: String,
        required: true
    },
    ram: {
        type: String,
        required: true
    }, procesador: {
        type: String,
        required: true
    },
    estado: {
        type: String,
        enum: [
            "Disponible",
            "Asignado",
            "Pendiente Reparacion",
            "En Reparacion",
            "Dado de Baja"
        ],
        required: true,
    },
    observaciones: {
        type: String,
        required: false,

    },
    fechaRegistro: {
        type: Date,
        default: Date.now
    },

    imagen: {
        type: String,
         default: null
    }


});

export default mongoose.model('Equipo', equipoSchema);