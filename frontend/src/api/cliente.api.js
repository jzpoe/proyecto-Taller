import axios from "axios"

const API = import.meta.env.VITE_API_URL;


export const obtenerClientes = () => {

    return axios.get(`${API}/clientes`)

}

// export const agregarClientes =(cliente)=>{
//     return axios.post(`${API}/cliente`, cliente)
// }

export const agregarClientes = async (cliente) => {

    const response = await axios.post(`${API}/cliente`,
        cliente)

    return response



}

export const buscarClientePorTelefono = async (telefono) => {

    const respuesta = await axios.get(
        `${API}/clientes/telefono/${telefono}`
    );

    return respuesta.data;

};













