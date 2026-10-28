import api from "./axiosConfig";

export const datosInventarioBackend = async (datos) => {
const response = await api.post("/inventario", datos);
return response.data;
};

export const obtenerInventario = async () => {
const response = await api.get("/inventario");
return response.data.obtenerInventario;
};
