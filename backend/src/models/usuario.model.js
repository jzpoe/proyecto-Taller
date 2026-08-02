import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({

    nombre:{

        type:String,

        required:true,

        trim:true

    },

    correo:{

        type:String,

        required:true,

        unique:true,

        trim:true,

        lowercase:true

    },

    contrasena:{

        type:String,

        required:true

    },

    rol:{

        type:String,

        enum:["Administrador","Tecnico","Recepcion"],

        default:"Administrador"

    },

    activo:{

        type:Boolean,

        default:true

    }

},{
    timestamps:true
});

export default mongoose.model("Usuario",usuarioSchema);