import axios from "axios"

const API = import.meta.env.VITE_API_URL;

export const inicioSesion= async(datosLogin)=>{

    
    const response = await axios.post(
        `${API}/login`,
        datosLogin
    )
    
    return response.data
    

}