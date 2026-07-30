import { useEffect, useState } from "react"
import { asignarEquipoId, obtenerEquipos } from "../api/equipo.api"
import { obtenerClientes } from "../api/cliente.api"
import { Check, PackageOpen, Search } from 'lucide-react';
import { BadgeEstado } from "../components/ui/BadgeEstado";
import toast from "react-hot-toast";




export const AsignarEquipoPage = () => {
    const [equipo, setEquipo] = useState([])
    const [clientes, setClientes] = useState([])
    const [clienteSeleccionado, setClienteSeleccionado] = useState("")
    const [equipoSeleccionado, setEquipoSeleccionado] = useState(null)
    const [buscadorEquipos, setBuscadorEquipos] = useState("")
    const [buscadorCliente, setBuscadorCliente] = useState("")

    const equipos = async () => {

        try {
            const response = await obtenerEquipos()
            setEquipo(response.data)
            console.log(response.data)

        } catch (error) {
            console.error("error al cargar los equipos")
        }

    }


    const asignacionesEquipo = async () => {
        try {

            const response = await asignarEquipoId(
                equipoSeleccionado._id,
                clienteSeleccionado
            )
         toast.success(response.data.message);

        } catch (error) {
           toast.error(error.response.data.message);
        }
    }

    const cargarClientes = async () => {

        try {
            const response = await obtenerClientes();
            setClientes(response.data)
        } catch (error) {
            console.error("error al cargar los clientes", error)
        }

    }

    useEffect(() => {
        equipos()
        cargarClientes()
    }, [])

    const disponibles = equipo.filter((equiposFiltrados) => {
        return equiposFiltrados.estado === "Disponible"
    })

    const equiposAAsignar = equipo.length

    const buscarEquipos = disponibles.filter((equipos) =>
        equipos.serial.toLowerCase().includes(buscadorEquipos.toLowerCase())
    );

    const buscarClientes = clientes.filter((buscarNombre)=>
    buscarNombre.nombre.toLowerCase().includes(buscadorCliente.toLowerCase())
)


    return (
        <>

            <div className="bg-white rounded-xl shadow-md p-6 mt-6 ">
                <p className="font-bold flex justify-between items-center p-4 border-b">Clientes Registrados</p>
                <div className="flex p-3 gap-4">
                    <Search className="w-5 h-5" />
                    <input onClick={(e) => { setBuscadorEquipos(e.target.value) }} className="w-full rounded-b-lg bg-gray-100" type="text" placeholder="Buscar Equipo" />

                </div >
                <div className="grid grid-cols-3 gap-6">
                    <table className="col-span-2">
                        <thead className="bg-gray-100 p-2">
                            <tr className="hover:bg-gray-50">
                                <th className="px-4 py-3 text-left w-2 ">Serial</th>
                                <th className="px-4 py-3 text-left w-2  ">Marca</th>
                                <th className="px-4 py-3 text-left w-2 ">Modelo</th>
                                <th className="px-4 py-3 text-left w-2 ">Estado</th>
                                <th className="px-4 py-3 text-left  ">Asignar</th>


                            </tr>
                        </thead>
                        <tbody >


                            {equiposAAsignar ?
                                buscarEquipos.map((equipo) => (
                                    <tr key={equipo._id} >
                                        <td className="px-4 py-3 text-left border-b "> {equipo.serial}</td>
                                        <td className="px-4 py-3 text-left border-b"> {equipo.marca}</td>
                                        <td className="px-4 py-3 text-left border-b"> {equipo.modelo}</td>

                                        <td className="px-4 py-3 text-left border-b">
                                            <BadgeEstado
                                                estado={equipo.estado}

                                            />
                                        </td>
                                        <td>
                                            <button className="mt-3 bg-blue-600 text-white px-3 py-2 rounded"
                                                onClick={() => { setEquipoSeleccionado(equipo) }}

                                            >
                                                <Check className="w-5 h-5" strokeWidth={3} />

                                            </button>
                                        </td>


                                    </tr>

                                ))
                                :
                                <tr>
                                    <td colSpan={9} >

                                        <td className="flex flex-col items-center justify-center py-16 h-full" >
                                            <PackageOpen size={60} className="text-gray-400" />

                                            <p className="text-xl font-semibold mt-4">
                                                No hay equipos registrados
                                            </p>
                                            <p className="text-gray-400 animate-pulse">
                                                Presione "Crear Equipo" para agregar el primero.
                                            </p>
                                        </td>



                                    </td>
                                </tr>
                            }
                        </tbody>

                    </table>

                    <div className="col-span-1">


                        {equipoSeleccionado ? (


                            <div className="bg-white rounded-lg shadow p-4 mt-4 w-3xs h-max ">
                                <div className="flex p-3 gap-4">
                                    <Search className="w-5 h-5" />
                                    <input onClick={(e) => { setBuscadorCliente(e.target.value) }} 
                                    className="w-full rounded-b-lg bg-gray-100" type="text" placeholder="Buscar Cliente" />

                                </div >
                                <h2 className="text-xs bg-amber-400 rounded-b-sm flex justify-center">Equipo Seleccionado</h2>


                                <select value={clienteSeleccionado}
                                    onChange={(e) => { setClienteSeleccionado(e.target.value) }}>

                                    <option value="">Cliente</option>

                                    { buscarClientes.map((cliente) => (
                                        <option
                                            key={cliente._id}
                                            value={cliente._id}
                                        >
                                            {cliente.nombre}
                                        </option>

                                    ))}
                                </select>

                                <p className="text-xs">Serial: {equipoSeleccionado.serial}</p>
                                <p className="text-xs">Estado: {equipoSeleccionado.estado}</p>
                                <p className="text-xs">Marca: {equipoSeleccionado.marca}</p>
                                <p className="text-xs">Modelo: {equipoSeleccionado.modelo}</p>
                                <img src={ `http://localhost:3000/${equipoSeleccionado.imagen}`} alt="" />

                                <button className="bg-green-600 text-white px-4 py-2 rounded mt-4"
                                    onClick={() => { asignacionesEquipo() }}
                                >Guardar Asignación</button>

                            </div>

                        )
                            : (
                                <div>
                                    <div colSpan={9} >

                                        <div className="flex flex-col items-center justify-center py-16 h-full" >
                                            <PackageOpen size={60} className="text-gray-400" />

                                            <p className="text-xl font-semibold mt-4">
                                                Seleccione un equipo
                                            </p>
                                            <p className="text-gray-400 animate-pulse">
                                                Presione el botón ✓ de la tabla para comenzar la asignación.
                                            </p>
                                        </div>



                                    </div>
                                </div>
                            )}
                    </div>



                </div>
            </div>
        </>
    )
}