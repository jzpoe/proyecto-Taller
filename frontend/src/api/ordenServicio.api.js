import api from "./axiosConfig";

export const crearOrdenServicio = async (orden) => {

    const response = await api.post(
        "/ordenServicio",
        orden
    );

    return response;

};


export const obtenerOrdenes = async () => {

    const response = await api.get(
        "/ordenServicio"
    );

    return response;

};


export const obtenerOrdenPorId = async (id) => {

    const response = await api.get(
        `/ordenServicio/${id}`
    );

    return response.data;

};


export const actualizarOrdenServicio = async (id, orden) => {

    const response = await api.put(
        `/ordenServicio/${id}`,
        orden
    );

    return response.data;

};


export const eliminarEquipoOrdenServicio = async (equipo_id) => {

    const response = await api.delete(
        `/ordenServicio/${equipo_id}`
    );

    return response.data;

};


export const actualizarCliente = async (id, cliente) => {

    const response = await api.put(
        `/cliente/${id}`,
        cliente
    );

    return response.data;

};