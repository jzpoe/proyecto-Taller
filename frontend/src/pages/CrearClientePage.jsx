import { useEffect, useState } from "react"
import { agregarClientes } from "../api/cliente.api"
import { ClientesPage } from "./ClientesPage"
export const CrearClientePage = () => {


    const [cliente, setCliente] = useState({
        nombre: "",
        cedula: "",
        telefono: "",
        correo: "",
        fecha: "",
        estado: "activo"
    })

    function handleChange(e) {
        const { name, value } = e.target
        setCliente({
            ...cliente,
            [name]: value
        })
    }

    const handleSubmit = (e) => {

        e.preventDefault()
        console.log(cliente)

        agregarClientes(cliente)



    }

    useEffect(() => { agregarClientes }, [])
    return (

        <div >
            <form onSubmit={handleSubmit} className="   "   >

                <label htmlFor="">Nombre</label>
                <input type="text"
                    placeholder="Escribe Nombre"
                    name="nombre"
                    value={cliente.nombre}
                    onChange={handleChange}
                />

                <label htmlFor="">Cedula</label>
                <input type="text"
                    placeholder="cedula"
                    name="cedula"
                    value={cliente.cedula}
                    onChange={handleChange}
                />

                <label htmlFor="">Telefono</label>
                <input type="text"
                    placeholder="telefono"
                    name="telefono"
                    value={cliente.telefono}
                    onChange={handleChange}
                />
                <label htmlFor="">Correo</label>
                <input type="text"
                    placeholder="Correo"
                    name="correo"
                    value={cliente.correo}
                    onChange={handleChange}
                />

                <label htmlFor="">Fecha</label>
                <input type="date"
                    placeholder="Fecha"
                    name="fecha"
                    value={cliente.fecha}
                    onChange={handleChange}
                />

                <label htmlFor="">Estado</label>
                <select
                    name="estado"
                    value={cliente.estado}
                    onChange={handleChange}
                >

                    <option value="activo">activo</option>
                    <option value="inactivo">inactivo</option>
                </select>

                <button type="submit">agregar</button>
            </form>
        </div>
    )
}