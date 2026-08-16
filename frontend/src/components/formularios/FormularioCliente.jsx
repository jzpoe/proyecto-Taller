import { useState } from "react";
import { Input } from "../ui/Input";
import { agregarClientes } from "../../api/cliente.api";
import { Check } from "lucide-react";
import { TextareaEquipos } from "../TextareaEquipos";
import toast from "react-hot-toast";



export const FormularioCliente = ({ onCrearCliente }) => {
    const [cliente, setCliente] = useState({
        nombre: "",
        cedula: "",
        telefono: "",
        correo: "",
        observaciones: "",
        estado: "activo",
    })

    const handleChange = (e) => {
        const { name, value } = e.target;

        setCliente({
            ...cliente,
            [name]: value
        })
    }

    const handleSubmit = async (e) => {

        e.preventDefault()
        try {
            const response = await agregarClientes(
                cliente
            )

            setCliente({
                nombre: "",
                cedula: "",
                telefono: "",
                correo: "",
                observaciones: "",
                fechaRegistro: "",
                estado: "activo",
            })
            onCrearCliente()
        } catch (error) {
            toast.error(error.response.data.message);

        }


    }



    return (

        <div className="flex justify-center p-6">

            <form action="" onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 w-full max-w-4xl" >

                <Input
                    label="Nombre"
                    type="text"
                    name="nombre"
                    placeholder="Ingrese el Nombre"
                    value={cliente.nombre}
                    onChange={handleChange}
                />

              

                <Input
                    label="Telefono"
                    type="text"
                    name="telefono"
                    placeholder="Ingrese el numero"
                    value={cliente.telefono}
                    onChange={handleChange}
                />

                <Input
                    label="Correo"
                    type="email"
                    name="correo"
                    placeholder="Ingrese el Correo"
                    value={cliente.correo}
                    onChange={handleChange}
                />

                <Input
                    label="Fecha"
                    type="date"
                    name="fechaRegistro"
                    value={cliente.fechaRegistro}
                    onChange={handleChange}
                />

                <select name="estado" value={cliente.estado}

                    onChange={handleChange}
                >
                    <option name="estado" value="activo">activo</option>
                    <option name="estado" value="inactivo">inactivo</option>
                </select>

                <TextareaEquipos
    className="col-span-2"
    label="Observaciones"
    type="text"
    name="observaciones"
    value={cliente.observaciones}
    onChange={handleChange}
/>

                <div>
                    <button type="submit" className="flex m-2 bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800">
                        Guardar <Check strokeWidth={3} />
                    </button>
                </div>



            </form>

        </div>
    )
}