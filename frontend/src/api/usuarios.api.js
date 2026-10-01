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

export const crearTecnico = async (datos) => {

    const response = await api.post(
        "/usuarios/tecnicos",
        datos
    );

    return response.data;

};

export const eliminarTecnicos = async (id)=>{
    const response = await api.delete(
        `/usuario/eliminar/${id}`
    )

    return response.data
};

export const editarTenicos =async (id, datos)=>{
    const response = await api.patch(
        `/usuario/actualizar/${id}`,
        datos
    )
    return response.data
};

