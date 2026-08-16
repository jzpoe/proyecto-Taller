import api from "./axiosConfig";

const API = import.meta.env.VITE_API_URL;

export const obtenerEquipos = () => {
    return api.get(`/equipos`)
    obtenerEquipos()
}


export const asignarEquipoId = async (equipoSeleccionado, clienteSeleccionado) => {
    
        const response = await api.post(
            `/equipo/${equipoSeleccionado}/asignar`,
            {
                cliente: clienteSeleccionado
            }
        )

        return response

    
}

export const agregarEquipos = async (equipos) => {

   
        const response = await api.post(`/equipos`,
            equipos
        )
        return response;
    

}

export const eliminarEquipoBackend = async (equipos_id) => {

    try {
        const response = await api.delete(`/equipo/${equipos_id}`)
         console.log(response.data);
        return response.data
       

    } catch (error) {
        console.error("error al eliminar equipo", error)
    }


}

export const editarEquipoBackend = async (equipo) => {

    try {

        const response = await api.put(

            `/equipo/${equipo._id}`,

            equipo

        );

        return response.data;

    } catch (error) {

        console.error("Error al actualizar equipo", error);

    }

}




