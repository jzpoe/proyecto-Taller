import mongoose from "mongoose";

const ordenServicioSchema = new mongoose.Schema(
  {
    numeroOrden: {
      type: String,
      unique: true,
    },


    cliente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cliente",
      required: true,
    },

    estado: {
      type: String,
      enum: [
        "Recibido",
        "En diagnóstico",
        "Listo para entregar",
        "Entregado",
      ],
      default: "Recibido",
    },

    problemaReportado: {
      type: String,
      required: true,
      trim: true,
    },

    tipoEquipo: {
      type: String,
      default: "",
    },

    marca: {
      type: String,
      default: "",
    },

    modelo: {
      type: String,
      default: "",
    },

    serial: {
      type: String,
      default: "",
    },

    diagnostico: {
      type: String,
      default: "",
    },

    solucion: {
      type: String,
      default: "",
    },

    valorCobro: {
      type: Number,
      default: 0,
    },

    garantia: {
      type: String,
      default: "",
    },
    fechaDiagnostico: {
      type: Date,
    },
    observacionesEntrega: {
      type: String,
      default: "",
    },

    fechaEntrega: {
      type: Date,
    },

    imagenes: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("OrdenServicio", ordenServicioSchema);