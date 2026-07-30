
import axios from "axios"

const API = import.meta.env.VITE_API_URL;

export const crearOrdenServicio = async (orden) => {

    const response = await axios.post(
        `${API}/ordenServicio`,
        orden
    );

    return response;

};

export const obtenerOrdenes = async () => {

    const response = await axios.get(
        `${API}/ordenServicio`
    );

    return response;

};