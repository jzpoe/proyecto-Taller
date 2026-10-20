import mongoose from "mongoose";


const inventarioSchema = new mongoose.Schema({

    nombre: {
        type: String,
        required: true,
        trim: true
    },

    categoria: {
        type: String,
        required: true,
        trim: true
    },

    variantes: [
        {

            atributos: {
                type: Map,
                of: String
            },
            stock: {
                type: Number,
                required: true,
                min: 0,
                default: 0
            },
            precio:{
               type: Number,
                required: true,
                min: 0,
                default: 0 
            }
        }
    ]


},
    {
        timestamps: true
    }
)

const Inventario = mongoose.model('Inventario', inventarioSchema);
export default Inventario