import mongoose from "mongoose";


const movimientoSchema = new mongoose.Schema({
    equipo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Equipo',
        required: true

    },
    cliente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cliente',
        required: true
    },
    tipoMovimiento: {
        type: String,
        enum: [
            "Asignacion",
            "Devolucion",
            "Ingreso Reparacion",
            "Salida Reparacion",
            "Baja"
        ],
        required: true
    },
    fechaMovimiento: {
        type: Date,
            default:Date.now

    },
    observaciones: {
        type: String,
    }
})

export default mongoose.model('Movimiento', movimientoSchema)