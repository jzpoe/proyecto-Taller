import api from "./axiosConfig";

export const obtenerClientes = async () => {
    const response = await api.get("/clientes");
    return response.data;
};

export const crearCliente = async (datos) => {
    const response = await api.post("/cliente", datos);
    return response.data;
};

export const registrarVenta = async (datos) => {
    const response = await api.post("/ventas", datos);
    return response.data;
};