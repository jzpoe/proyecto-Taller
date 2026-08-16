import api from "./axiosConfig";

export const inicioSesion= async(datosLogin)=>{

    
    const response = await api.post(
        `/login`,
        datosLogin
    )
    
    return response.data
    

}