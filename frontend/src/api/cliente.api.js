import api from "./axiosConfig";


export const obtenerClientes = () => {

    return api.get(`/clientes`)

}

// export const agregarClientes =(cliente)=>{
//     return axios.post(`${API}/cliente`, cliente)
// }

export const agregarClientes = async (cliente) => {

    const response = await api.post(`/cliente`,
        cliente)

    return response



}

export const buscarClientePorTelefono = async (telefono) => {

    const respuesta = await api.get(
        `/clientes/telefono/${telefono}`
    );

    return respuesta.data;

};













