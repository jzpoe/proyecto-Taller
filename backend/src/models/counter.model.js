import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        unique: true
    },

    secuencia: {
        type: Number,
        default: 0
    }
});

export default mongoose.model("Counter", counterSchema);