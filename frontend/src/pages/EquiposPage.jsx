import { useState } from "react"
import { obtenerEquipos } from "../api/equipo.api";
import { useEffect } from "react";
import { AsignarEquipoPage } from "./AsignarEquipoPage";
import { BadgeEstado } from "../components/ui/BadgeEstado";
import { PackageOpen } from "lucide-react";
import noPhoto from '../assets/no-photo-image.png'
import { Paginacion } from "../components/ui/Paginacion";


export const EquiposPage = ({ onEditar }) => {
    const [equipos, setEquipos] = useState([]);
    const [paginaActual, setPaginaActual] = useState(1);
    const [imagenSeleccionada, setImagenSeleccionada] = useState(null)


    const equiposPorPagina = 8;

    const indiceInicio = (paginaActual - 1) * equiposPorPagina
    const indiceFin = indiceInicio + equiposPorPagina
    const equiposPagina = equipos.slice(indiceInicio, indiceFin);

    const totalDePaginas = Math.ceil(
        equipos.length / equiposPorPagina
    )





    const cargarEquipos = async () => {
        try {

            const response = await obtenerEquipos()
            setEquipos(response.data)


        } catch (error) {
            console.error("error al cargar los equipos")

        }
    }
    useEffect(() => {
        cargarEquipos()
    }, [])

    const totalEquipos = equipos.length

    useEffect(() => {

        if (paginaActual > totalDePaginas) {

            setPaginaActual(1);

        }

    }, [equipos]);

    return (

        <div className="
                    bg-white
                    rounded-2xl
                    shadow-lg
                    border
                    border-gray-200
                    p-6
                    mt-6 max-h-[90vh] overflow-y-auto
                    ">

            <div className="flex justify-between items-center border-b pb-4 mb-6">

                <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                        Equipos Registrados
                    </h2>

                    <p className="text-sm text-gray-500">
                        Total de equipos: {totalEquipos}
                    </p>
                </div>

            </div>

            <div className=" overflow-x-auto">
                <table className="min-w-[1000px] w-full">
                    <thead className="bg-gray-50 text-gray-700 uppercase text-xs tracking-wider">
                        <tr className="hover:bg-blue-50 transition-colors duration-200">
                            <th className="text-center">Serial</th>
                            <th className="text-center">Modelo</th>
                            <th className="text-center">Marca</th>
                            <th className="text-center">Estado</th>
                            <th className="text-center">Observaciones</th>

                            <th className="px-4 py-3 text-left">Imagen</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">

                        {totalEquipos ?

                            equiposPagina.map((equipo) => {

                                const imagenEquipo = equipo.imagen
                                    ? `http://localhost:3000/${equipo.imagen}`
                                    : noPhoto;
                                return (

                                    <tr key={equipo._id} className="hover:bg-blue-50 transition-colors duration-200">

                                        <td className="max-w-xs truncate text-center">{equipo.serial}</td>
                                        <td className="max-w-xs truncate text-center">{equipo.modelo}</td>
                                        <td className="max-w-xs truncate text-center">{equipo.marca}</td>
                                        <td className="max-w-xs truncate text-center">
                                            <BadgeEstado
                                                estado={equipo.estado}
                                            />
                                        </td>
                                        <td className="max-w-xs truncate">{equipo.observaciones} </td>

                                        <td >

                                            <img
                                                src={imagenEquipo}
                                                onClick={() => setImagenSeleccionada(imagenEquipo)}
                                                className=" w-20 h-20 object-cover rounded-xl border border-gray-200 shadow-sm
                                                cursor-pointer hover:scale-110 hover:shadow-lg transition-all duration-300
"                                                alt={equipo.serial}
                                            />


                                        </td>

                                    </tr>
                                )
                            })


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
                {
                    imagenSeleccionada && (

                        <div
                            className="fixed inset-0 bg-black/70 flex justify-center items-center z-50"
                            onClick={() => setImagenSeleccionada(null)}
                        >

                            <img
                                src={imagenSeleccionada}
                                onClick={(event) => { event.stopPropagation() }}
                                className="max-w-5xl max-h-[90vh] rounded-xl shadow-2xl"
                            />

                        </div>

                    )
                }

            </div>
            <Paginacion
                paginaActual={paginaActual}
                totalPaginas={totalDePaginas}
                cambiarPagina={setPaginaActual}
                totalRegistros={equipos.length}
                registrosPorPagina={equiposPorPagina}
            />
        </div >
    )



}