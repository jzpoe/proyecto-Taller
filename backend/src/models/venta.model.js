import mongoose from "mongoose";


const ventaSchema = new mongoose.Schema({


    cliente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cliente",
        required: true,
    },
    productos: [{

        producto: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Producto",
            required: true,
        },

        cantidad: {
            type: Number,
            required: true
        },
        precioUnitario: {
            type: Number,
            required: true,
        },
        subtotal: {
            type: Number,
            required: true
        }



    }]


},

    {
        timestamps: true

    }
);
export default mongoose.model("Venta", ventaSchema);