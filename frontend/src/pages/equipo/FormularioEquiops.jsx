import { useState } from "react"
import { agregarEquipos } from "../../api/equipo.api"
import { InputEquipos } from "./InputEquipos";
import { useEffect } from "react";
import { Check } from 'lucide-react';
import toast from "react-hot-toast";
import { TextareaEquipos } from "../../components/TextareaEquipos";


export const FormularioEquipos = ({ onEquipoCreado, equipoEditar }) => {
    const [equipos, setEquipos] = useState(
        {

            serial: "",
            tipoEquipo: "",
            marca: "",
            modelo: "",
            ram: "",
            procesador: "",
            estado: "Disponible",
            observaciones: "",
            fechaRegistro: "",
            imagenes: null

        });

    const [mostrarImagen, setMostrarImagen] = useState("");


    const handleOnchange = (e) => {
        const { name, value, type, files } = e.target

        let dato

        if (type === "file") {
            dato = files[0];
        } else {
            dato = value
        }
        setEquipos({
            ...equipos,
            [name]: dato

        })
    }


    const handleSubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData();
        for (const [clave, valor] of Object.entries(equipos)) {
            formData.append(clave, valor)
        }
        try {
            await agregarEquipos(formData)
            setEquipos({
                serial: "",
                tipoEquipo: "",
                marca: "",
                modelo: "",
                ram: "",
                procesador: "",
                estado: "Disponible",
                observaciones: "",
                fechaRegistro: "",
                imagen: "",
            })
            toast.success('El equipo se ha creado correctamente.');

            onEquipoCreado()

        } catch (error) {
            toast.error(error.response.data.message);
        }

    }

    return (
        <div className="flex justify-center p-6">


            <form action="" onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 w-full max-w-4xl" >
                <InputEquipos
                    label="serial"
                    type="text"
                    name="serial"
                    placeholder="Serial"
                    value={equipos.serial}
                    onchange={handleOnchange}
                />

                <InputEquipos
                    label="Tipo de Equipo"
                    type="text"
                    placeholder="Tipo de Equipo"
                    name="tipoEquipo"
                    value={equipos.tipoEquipo}
                    onchange={handleOnchange}
                />
                <InputEquipos
                    label="Marca"
                    type="text"
                    placeholder="Marca"
                    name="marca"
                    value={equipos.marca}
                    onchange={handleOnchange}
                />
                <InputEquipos
                    label="Modelo"
                    type="text"
                    placeholder="Modelo"
                    name="modelo"
                    value={equipos.modelo}
                    onchange={handleOnchange}
                />
                <InputEquipos
                    label="Ram"
                    type="text"
                    placeholder="ram"
                    name="ram"
                    value={equipos.ram}
                    onchange={handleOnchange}

                />
                <InputEquipos
                    label="Procesador"
                    type="text"
                    placeholder="Procesador"
                    name="procesador"
                    value={equipos.procesador}
                    onchange={handleOnchange}

                />

                <InputEquipos
                    label="Fecha de Registro"
                    type="date"
                    placeholder="Fehca de Registro"
                    name="fechaRegistro"
                    value={equipos.fechaRegistro}
                    onchange={handleOnchange}
                />


                <select name="estado" value={equipos.estado} onChange={handleOnchange} id="">

                    <option value="Disponible" className="bg-green-300">Disponible</option>
                    <option value="Asignado" className="bg-blue-300">Asignado</option>
                    <option value="En Reparacion" className="bg-orange-300">En Reparacion</option>
                    <option value="Dado de Baja" className="bg-red-300" >Dado de Baja</option>
                </select>






                <TextareaEquipos
                    className="col-span-2"
                    label="Observaciones"
                    placeholder="observaciones"
                    name="observaciones"
                    value={equipos.observaciones}
                    onchange={handleOnchange}
                />

                <input
                    className="col-span-2" type="file"
                    name="imagen"
                    onChange={handleOnchange}
                />

                <div className="col-span-2">
                    <button type="submit" type="submit" className="col-span-2 flex justify-end  m-2
                     bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 max-w-4xl"
                    >Agregar  <Check strokeWidth={3} />
                    </button>
                </div>


            </form>

        </div>
    )
}