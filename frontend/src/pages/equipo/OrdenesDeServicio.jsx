import { useEffect, useState } from "react";
import { SearchBar } from "../../components/ui/SearchBar";
import { BadgeEstado } from "../../components/ui/BadgeEstado";
import { Pencil, Trash, ClipboardList } from "lucide-react";
import { actualizarOrdenServicio, eliminarEquipoOrdenServicio, obtenerOrdenes } from "../../api/ordenServicio.api";
import { generarOrdenPDF } from "../../utils/generarOrdenPDF";
import { Paginacion } from "../../components/ui/Paginacion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { obtenerMisOrdenes } from "../../api/usuarios.api";

export const OrdenesDeServicio = () => {

    const [ordenes, setOrdenes] = useState([]);
    const [buscar, setBuscar] = useState("");
    const [paginaActual, setPaginaActual] = useState(1);
    const navigate = useNavigate();
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const esTecnico = usuario?.rol === "Tecnico";

    const registrosPorPagina = 10;

    const cargarOrdenes = async () => {

        try {

            if (esTecnico) {

                const response = await obtenerMisOrdenes();

                setOrdenes(response.ordenes);

            } else {

                const response = await obtenerOrdenes();

                setOrdenes(response.data);

            }

        } catch (error) {

            console.error("Error al obtener las órdenes:", error);

        }

    };

    const handleEliminar = async (equipos_id) => {

        try {
            const resultado = await Swal.fire({
                icon: "warning",

                title: "¿Está seguro?",

                text: "Esta acción no se puede deshacer.",

                showCancelButton: true,

                confirmButtonText: "Sí, eliminar",

                cancelButtonText: "Cancelar"
            })
            if (resultado.isConfirmed) {

                await eliminarEquipoOrdenServicio(equipos_id)
                cargarOrdenes()
                toast.success('El equipo se ha eliminado correctamente.');

            }

        } catch (error) {
            console.error("error al elimianr el equipo seleccionado", error)
        }

    }

    const cambiarEstado = async (orden, nuevoEstado) => {

        try {

            const response = await actualizarOrdenServicio(
                orden._id,
                {
                    estado: nuevoEstado
                }
            );

            setOrdenes((ordenesActuales) =>
                ordenesActuales.map((ordenActual) =>
                    ordenActual._id === orden._id
                        ? {
                            ...ordenActual,
                            ...response.orden
                        }
                        : ordenActual
                )
            );

            toast.success("Estado actualizado correctamente.");

        } catch (error) {

            console.error("Error al cambiar el estado:", error);

            toast.error(
                error.response?.data?.mensaje ||
                "No se pudo actualizar el estado."
            );

        }
    };




    useEffect(() => {

        cargarOrdenes();

    }, []);
    useEffect(() => {

        setPaginaActual(1);

    }, [buscar]);



    const formatearFecha = (fecha) => {

        if (!fecha) return "";

        const fechaObj = new Date(fecha);

        const dia = String(fechaObj.getDate()).padStart(2, "0");
        const mes = String(fechaObj.getMonth() + 1).padStart(2, "0");
        const ano = fechaObj.getFullYear();

        return `${dia}/${mes}/${ano}`;

    };

    const ordenesFiltradas = ordenes.filter((orden) => {

        const texto = buscar.toLowerCase();

        return (

            orden.numeroOrden?.toLowerCase().includes(texto) ||

            orden.cliente?.nombre?.toLowerCase().includes(texto) ||

            orden.cliente?.telefono?.includes(texto) ||

            orden.marca?.toLowerCase().includes(texto) ||

            orden.modelo?.toLowerCase().includes(texto) ||

            orden.serial?.toLowerCase().includes(texto) ||

            orden.problemaReportado?.toLowerCase().includes(texto) ||

            orden.estado?.toLowerCase().includes(texto) ||

            orden.tecnicoAsignado?.nombre?.toLowerCase().includes(texto)

        );

    });


    const indiceFinal = paginaActual * registrosPorPagina;

    const indiceInicial = indiceFinal - registrosPorPagina;

    const ordenesPaginadas = ordenesFiltradas.slice(
        indiceInicial,
        indiceFinal
    );

    const totalPaginas = Math.ceil(
        ordenesFiltradas.length / registrosPorPagina
    );

    return (

        <div className="bg-white rounded-lg shadow mt-6">

            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 p-4 border-b">
                <div>

                    <h2 className="text-2xl font-bold">

                        Órdenes de Servicio

                    </h2>

                    <p className="text-gray-500">

                        Total de órdenes: {ordenes.length}

                    </p>

                </div>

                <SearchBar

                    placeholder="Buscar orden o cliente..."

                    value={buscar}

                    onChange={(e) => setBuscar(e.target.value)}

                />

            </div>
            <div className="overflow-x-auto">


                <table className="w-full min-w-[1500px] border-collapse">
                    <thead className="bg-gray-100">

                        <tr>

                            <th className="px-4 py-3 text-left">Orden</th>

                            <th className="px-4 py-3 text-left">Cliente</th>

                            <th className="px-4 py-3 text-left">Teléfono</th>

                            <th className="px-4 py-3 text-left">Equipo</th>

                            <th className="px-4 py-3 text-left">Serial</th>

                            <th className="px-4 py-3 text-left">Daño reportado</th>

                            <th className="px-4 py-3 text-left">Estado</th>

                            <th className="px-4 py-3 text-left">Técnico</th>

                            <th className="px-4 py-3 text-left">Fecha</th>

                            <th className="px-4 py-3 text-center">Ver</th>

                            {!esTecnico && (
                                <th className="px-4 py-3 text-center">
                                    Eliminar
                                </th>
                            )}

                            {!esTecnico && (
                                <th className="px-4 py-3 text-center">
                                    Descargar PDF
                                </th>
                            )}

                        </tr>

                    </thead>

                    <tbody>

                        {

                            ordenesFiltradas.length > 0

                                ?

                                ordenesPaginadas.map((orden) => (

                                    <tr

                                        key={orden._id}

                                        className="hover:bg-gray-50"

                                    >

                                        <td className="px-4 py-3">

                                            {orden.numeroOrden}

                                        </td>

                                        <td className="px-4 py-3">

                                            {orden.cliente?.nombre}

                                        </td>

                                        <td className="px-4 py-3">

                                            {orden.cliente?.telefono}

                                        </td>

                                        <td className="px-4 py-3">

                                            {orden.marca} {orden.modelo}

                                        </td>

                                        <td className="px-4 py-3">
                                            {orden.serial || "Sin serial"}
                                        </td>

                                        <td className="px-4 py-3">
                                            {orden.problemaReportado || "Sin información"}
                                        </td>

                                        <td className="px-4 py-3">

                                            <td className="px-4 py-3">

                                                {esTecnico ? (

                                                    <select
                                                        value={orden.estado}
                                                        onChange={(e) =>
                                                            cambiarEstado(
                                                                orden,
                                                                e.target.value
                                                            )
                                                        }
                                                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
                                                    >

                                                        <option value="Recibido">
                                                            Recibido
                                                        </option>

                                                        <option value="En diagnóstico">
                                                            En diagnóstico
                                                        </option>

                                                        <option value="Esperando aprobación">
                                                            Esperando aprobación
                                                        </option>

                                                        <option value="Reparando">
                                                            Reparando
                                                        </option>

                                                        <option value="Listo para entregar">
                                                            Listo para entregar
                                                        </option>

                                                        <option value="Entregado">
                                                            Entregado
                                                        </option>

                                                    </select>

                                                ) : (

                                                    <BadgeEstado
                                                        estado={orden.estado}
                                                    />

                                                )}

                                            </td>

                                        </td>
                                        <td className="px-4 py-3">
                                            {orden.tecnicoAsignado?.nombre || "Sin asignar"}
                                        </td>
                                        <td className="px-4 py-3">

                                            {formatearFecha(orden.createdAt)}

                                        </td>

                                        <td className="px-4 py-3">



                                            <button
                                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg shadow transition"

                                                onClick={() => navigate(`/ordenServicio/${orden._id}`)} >ver</button>



                                        </td>

                                        {/* <td className="text-center">

                                            <button
                                                onClick={() => navigate(`/ordenServicio/${orden._id}`)}
                                                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg shadow transition"
                                            >
                                                <Pencil size={18} />
                                            </button>

                                        </td> */}

                                        {!esTecnico && (
                                            <td className="text-center">

                                                <button
                                                    onClick={() => handleEliminar(orden._id)}
                                                    className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg shadow transition"
                                                >
                                                    <Trash size={20} />
                                                </button>

                                            </td>
                                        )}
                                        {!esTecnico && (
                                            <button
                                                onClick={() => generarOrdenServicioPDF(orden)}
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                                            >
                                                PDF
                                            </button>
                                        )}

                                    </tr>

                                ))

                                :

                                <tr>

                                    <td colSpan={esTecnico ? 11 : 12}>
                                        <div className="flex flex-col items-center justify-center py-16">

                                            <ClipboardList

                                                size={60}

                                                className="text-gray-400"

                                            />

                                            <p className="text-xl font-semibold mt-4">

                                                No hay órdenes registradas

                                            </p>

                                            <p className="text-gray-400 animate-pulse">

                                                Presione "Crear Orden de Servicio"

                                            </p>

                                        </div>

                                    </td>

                                </tr>

                        }

                    </tbody>

                </table>

            </div>
            <Paginacion
                paginaActual={paginaActual}
                totalPaginas={totalPaginas}
                cambiarPagina={setPaginaActual}
                totalRegistros={ordenesFiltradas.length}
                registrosPorPagina={registrosPorPagina}
            />
        </div>

    );

};