import axios from "axios"

const API = import.meta.env.VITE_API_URL;

export const obtenerEquipos = () => {
    return axios.get(`${API}/equipos`)
    obtenerEquipos()
}


export const asignarEquipoId = async (equipoSeleccionado, clienteSeleccionado) => {
    
        const response = await axios.post(
            `${API}/equipo/${equipoSeleccionado}/asignar`,
            {
                cliente: clienteSeleccionado
            }
        )

        return response

    
}

export const agregarEquipos = async (equipos) => {

   
        const response = await axios.post(`${API}/equipos`,
            equipos
        )
        return response;
    

}

export const eliminarEquipoBackend = async (equipos_id) => {

    try {
        const response = await axios.delete(`${API}/equipo/${equipos_id}`)
        return response.data

    } catch (error) {
        console.error("error al eliminar equipo", error)
    }


}

export const editarEquipoBackend = async (equipo) => {

    try {

        const response = await axios.put(

            `${API}/equipo/${equipo._id}`,

            equipo

        );

        return response.data;

    } catch (error) {

        console.error("Error al actualizar equipo", error);

    }

}




