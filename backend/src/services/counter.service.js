import Counter from "../models/counter.model.js";

export const obtenerSiguienteNumero = async (nombre) => {

    const contador = await Counter.findOneAndUpdate(
        { nombre },
        { $inc: { secuencia: 1 } },
        {
            new: true,
            upsert: true
        }
    );

    return contador.secuencia;
}