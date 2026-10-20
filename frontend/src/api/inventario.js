import api from "./axiosConfig";

const API = import.meta.env.VITE_API_URL;

export const datosInventarioBackend =async(datos)=>{

    const response = await api.post("/inventario", datos);

    return response.data


}

export const obtenerInventario =async()=>{

    const response = await api.get("/inventario")

    return response.data.obtenerInventario
}