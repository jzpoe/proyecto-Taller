import api from "./axiosConfig";

export const obtenerUsuarios = async () => {

    const response = await api.get(
        "/usuarios"
    );

    return response.data;

};

export const obtenerTecnicos = async () => {

    const response = await api.get(
        "/usuarios/tecnicos"
    );

    return response.data;

};

export const asignarTecnico = async (id, tecnicoId) => {

    const response = await api.put(
        `/ordenServicio/${id}/asignar-tecnico`,
        {
            tecnicoId
        }
    );

    return response.data;

};

export const obtenerMisOrdenes = async () => {

    const response = await api.get(
        "/ordenServicio/mis-ordenes"
    );

    return response.data;

};