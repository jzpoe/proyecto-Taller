import axios from "axios";


const API_URL = import.meta.env.VITE_API_URL;

export const cambiarContrasenaApi = async (datos, token) => {
    const respuesta = await axios.put(
        `${API_URL}/cambiar-contrasena`,
        datos,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )
    return respuesta.data
}