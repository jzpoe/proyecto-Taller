import { useEffect } from "react"
import { InputEquipos } from "../pages/equipo/InputEquipos"
import { useState } from "react";
import { Pencil } from 'lucide-react';
import { editarEquipoBackend } from "../api/equipo.api";
import Swal from "sweetalert2";
import toast from "react-hot-toast";



export const InputEditarEquipo = ({ equipoEditar, onEquipoActualizado, cerrarModal }) => {
    const [equipo, setEquipo] = useState(
        {

            serial: "",
            tipoEquipo: "",
            marca: "",
            modelo: "",
            estado: "Disponible",
            observaciones: "",
            fechaRegistro: ""


        });

    const handleOnchange = (e) => {
        const { name, value } = e.target
        setEquipo({
            ...equipo,
            [name]: value
        })
    }

    useEffect(() => {
        if (equipoEditar) {
            setEquipo(equipoEditar)

        }
        console.log("lleggo desde equipoEditar ", equipoEditar)
    }, [equipoEditar])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const resultado = await Swal.fire({
                icon: "warning",
                title: "¿Guardar cambio?",
                text: "Se actualizará la información del equipo.",
                showCancelButton: true,
                confirmButtonText: "Sí, Guardar",
                cancelButtonText: "Cancelar"
            })
            if (resultado.isConfirmed) {
                await editarEquipoBackend(equipo);
                await onEquipoActualizado();
                cerrarModal();
                toast.success("Equipo actualizado correctamente.");

            }
        } catch (error) {
            console.error("error al actualizar equipo seleccionado", error)

        }
    }



    return (
        <form action="" onSubmit={handleSubmit}>




            <label htmlFor="">Serial</label>
            <InputEquipos className= "bg-blue-200 rounded-b-lg"
                type="text"
                placeholder="Serial"
                name="serial"
                value={equipo.serial}
                onchange={handleOnchange}

            />



            <label htmlFor="">Tipo de Equipo</label>
            <InputEquipos
                type="text"
                placeholder="Tipo de Equipo"
                name="tipoEquipo"
                value={equipo.tipoEquipo}
                onchange={handleOnchange}



            />



            <label htmlFor="">Marca</label>
            <InputEquipos
                type="text"
                placeholder="Marca"
                name="marca"
                value={equipo.marca}
                onchange={handleOnchange}



            />



            <label htmlFor="">Modelo</label>
            <InputEquipos
                type="text"
                placeholder="Modelo"
                name="modelo"
                value={equipo.modelo}

                onchange={handleOnchange}


            />

            <label htmlFor="">Estado</label>
            <select name="estado" value={equipo.estado} onChange={handleOnchange} id="">

                <option value="Disponible">Disponible</option>
                <option value="Asignado">Asignado</option>
                <option value="Pendiente Reparacion">Pendiente Reparacion</option>
                <option value="En Reparacion">En Reparacion</option>
                <option value="Dado de Baja">Dado de Baja</option>
            </select>



            <label htmlFor="">Observaciones</label>

            <InputEquipos
                type="text"
                placeholder="observaciones"
                name="observaciones"
                value={equipo.observaciones}
                onchange={handleOnchange}


            />

            <label htmlFor="">Fecha de Registro</label>
            <InputEquipos

                type="date"
                placeholder="Fehca de Registro"
                name="fechaRegistro"
                value={equipo.fechaRegistro}
                onchange={handleOnchange}

            />

            <button type="submit" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700
             text-white px-4 py-2 rounded-lg shadow-md transition-all duration-200 hover:scale-105">
                <Pencil size={18} />
                Editar</button>


        </form>
    )

}