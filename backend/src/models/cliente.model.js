import mongoose from "mongoose";

const clienteSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true,
            trim: true
        },

        telefono: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        correo: {
            type: String,
            default: "",
            trim: true
        },

        estado: {
            type: String,
            default: "activo"
        }

    }, {
    timestamps: true
}
);

export default mongoose.model("Cliente", clienteSchema);