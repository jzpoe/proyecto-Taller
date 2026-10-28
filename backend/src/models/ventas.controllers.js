
import mongoose from "mongoose";

const detalleVentaSchema = new mongoose.Schema(
    {
        producto: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Inventario",
            required: true
        },

        varianteId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
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
        }
    },
    { _id: false }
);

const ventaSchema = new mongoose.Schema(
    {
        cliente: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Cliente",
            required: true
        },

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
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Venta", ventaSchema);

