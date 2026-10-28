import mongoose from "mongoose";

const detalleVentaSchema = new mongoose.Schema({
    inventarioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Inventario",
        required: true
    },

    varianteId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    nombreProducto: {
        type: String,
        required: true
    },

    atributos: {
        type: Map,
        of: String,
        default: {}
    },

    cantidad: {
        type: Number,
        required: true,
        min: 1
    },

    costoUnitario: {
        type: Number,
        required: true,
        min: 0
    },

    precioUnitario: {
        type: Number,
        required: true,
        min: 0
    },

    subtotal: {
        type: Number,
        required: true,
        min: 0
    },

    costoTotal: {
        type: Number,
        required: true,
        min: 0
    },

    gananciaBruta: {
        type: Number,
        required: true
    }
}, { _id: false });

const ventaSchema = new mongoose.Schema({
    productos: {
        type: [detalleVentaSchema],
        required: true,
        validate: {
            validator: productos => productos.length > 0,
            message: "La venta debe contener al menos un producto."
        }
    },

    total: {
        type: Number,
        required: true,
        min: 0
    },

    costoTotal: {
        type: Number,
        required: true,
        min: 0
    },

    gananciaBruta: {
        type: Number,
        required: true
    }
}, { timestamps: true });

const Venta = mongoose.model("Venta", ventaSchema);

export default Venta;