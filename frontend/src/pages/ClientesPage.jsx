import { useState, useEffect } from "react"
import { obtenerClientes } from "../api/cliente.api"
import { BadgeEstado } from "../components/ui/BadgeEstado"
import { PackageOpen } from "lucide-react"


export const ClientesPage = () => {
    const [clientes, setClientes] = useState([])
    const [paginaActual, setPaginaActual] = useState(1);

    const clientesPorPaginas = 8;

    const indiceInicio = (paginaActual - 1) * clientesPorPaginas
    const indiceFin = indiceInicio + clientesPorPaginas
    const clientesPagina = clientes.slice(indiceInicio, indiceFin);

    const totalDePaginas = Math.ceil(
        clientes.length / clientesPorPaginas
    )
    console.log("pagina actual", paginaActual)
    const siguiente = () => {
        if (paginaActual < totalDePaginas) {
            setPaginaActual(paginaActual + 1)

        }

    }
    const anterior = () => {
        if (paginaActual > 1) {
            setPaginaActual(paginaActual - 1)

        }
    }

    const cargarClientes = async () => {
        try {
            const response = await obtenerClientes()

            console.log("Respuesta API:", response.data)
            setClientes(response.data)

        } catch (error) {
            console.error("error al cargar los clientes")
        }
    }

    useEffect(() => {
        cargarClientes()

    }, [])

    const formatearFecha = (fecha) => {
        const formato = new Date(fecha)

        let dia = String(formato.getDate()).padStart(2, 0)
        let mes = String(formato.getMonth()).padStart(2, 0)
        let ano = formato.getFullYear();


        if (formato != "NaN") {
            return `${dia}/${mes}/${ano}`
        }
    }

    const ultimosClientes = clientes.slice(0, 9)
    const totalClientes = clientes.length
    return (
        <>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mt-6 max-h-[90vh] overflow-y-auto " >

                <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                        Clientes Registrados
                    </h2>
                    <p className="text-sm text-gray-500">
                        Total de clientes: {totalClientes}
                    </p>
                </div>
                <div className=" overflow-x-auto">
                    <table className="min-w-full   ">
                        <thead className="bg-gray-50 text-gray-700 uppercase text-xs tracking-wider">
                            <tr className="hover:bg-blue-50 transition-colors duration-200">
                                <th className="text-center">Nombre</th>
                                <th className="text-center">Cedula</th>
                                <th className="text-center">Telefono</th>

                                <th className="text-center">Estado</th>
                                <th className="text-center">Fecha</th>


                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {totalClientes ?
                                clientesPagina.map((cliente) => (
                                    <tr key={cliente._id} className="hover:bg-blue-50 transition-colors duration-200">
                                        <td className="max-w-xs truncate text-center">Nombre: {cliente.nombre}</td>
                                        <td className="max-w-xs truncate text-center">Cedula: {cliente.cedula}</td>
                                        <td className="max-w-xs truncate text-center">Telefono: {cliente.telefono}</td>
                                        <td className="max-w-xs truncate text-center">
                                            <BadgeEstado
                                                estado={cliente.estado}

                                            />
                                        </td>
                                        <td className="max-w-xs truncate text-center">{formatearFecha(cliente.fechaRegistro)} </td>


                                        <td className="max-w-xs truncate text-center"></td>
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

                    <div className="flex items-center justify-between mt-6 border-t pt-4">

                        <button
                            onClick={anterior}
                            disabled={paginaActual === 1}
                            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200
        ${paginaActual === 1
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md"
                                }`}
                        >
                            ← Atrás
                        </button>

                        <p className="text-gray-600 font-semibold">
                            Página <span className="text-blue-600">{paginaActual}</span> de{" "}
                            <span className="text-blue-600">{totalDePaginas}</span>
                        </p>

                        <button
                            onClick={siguiente}
                            disabled={paginaActual === totalDePaginas}
                            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200
        ${paginaActual === totalDePaginas
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md"
                                }`}
                        >
                            Siguiente →
                        </button>

                    </div>
                </div>
            </div >



        </>

    )


}