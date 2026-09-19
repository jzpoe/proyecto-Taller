import { useEffect, useState, Fragment } from "react";
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
    const [clienteExpandido, setClienteExpandido] = useState(null);
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

    const ordenesPorCliente = ordenesFiltradas.reduce((acumulador, orden) => {

    const telefono = orden.cliente?.telefono;

    if (!telefono) {
        return acumulador;
    }

    const clienteExistente = acumulador.find(
        (item) => item.telefono === telefono
    );

    if (clienteExistente) {

        clienteExistente.ordenes.push(orden);

    } else {

        acumulador.push({
            telefono: telefono,
            cliente: orden.cliente,
            ordenes: [orden]
        });

    }

    return acumulador;

}, []);




    const indiceFinal = paginaActual * registrosPorPagina;
    const indiceInicial = indiceFinal - registrosPorPagina;

    const clientesPaginados = ordenesPorCliente.slice(
        indiceInicial,
        indiceFinal
    );



    const totalPaginas = Math.ceil(
        ordenesPorCliente.length / registrosPorPagina
    );

    return (
        <div>

            {/* Aquí va todo lo que ya tienes arriba:
            título, buscador, botones, etc. */}

            <div className="space-y-4">

                {ordenesFiltradas.length > 0 ? (

                    clientesPaginados.map((grupo) => {

                        const estaExpandido =
                            clienteExpandido === grupo.cliente._id;

                        return (
                            <div
                                key={grupo.cliente._id}
                                className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-shadow hover:shadow-md"
                            >

                                {/* CLIENTE */}

                                <button
                                    onClick={() =>
                                        setClienteExpandido(
                                            estaExpandido
                                                ? null
                                                : grupo.cliente._id
                                        )
                                    }
                                    className="w-full flex items-center justify-between px-5 py-4
               bg-white hover:bg-gray-50
               transition-colors duration-200"
                                >

                                    <div className="flex items-center gap-3">

                                        <span className="text-blue-500 text-sm">
                                            {estaExpandido ? "▼" : "▶"}
                                        </span>

                                        <span className="font-semibold text-gray-800">
                                            {grupo.cliente?.nombre}
                                        </span>

                                        <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                                            {grupo.ordenes.length} solicitudes
                                        </span>

                                    </div>

                                    <span className="text-sm text-gray-400">
                                        {grupo.cliente?.telefono}
                                    </span>

                                </button>


                                {/* SOLICITUDES */}

                                {estaExpandido && (

                                    <div className="bg-gray-50/70 px-5 py-4 space-y-3 border-t border-gray-100">

                                        {grupo.ordenes.map((orden) => (

                                            <div
                                                key={orden._id}
                                                className="bg-white border border-gray-200 rounded-xl p-4
               shadow-sm hover:shadow-md
               transition-shadow duration-200"
                                            >

                                                {/* INFORMACIÓN */}

                                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">

                                                    <div>
                                                        <p className="text-[11px] uppercase tracking-wide text-gray-400 mb-1">
                                                            Orden
                                                        </p>

                                                        <p className="font-semibold text-gray-800">
                                                            {orden.numeroOrden}
                                                        </p>
                                                    </div>


                                                    <div>
                                                        <p className="text-xs text-gray-500">
                                                            Equipo
                                                        </p>

                                                        <p className="text-sm text-gray-700">
                                                            {orden.marca} {orden.modelo}
                                                        </p>
                                                    </div>


                                                    <div>
                                                        <p className="text-xs text-gray-500">
                                                            Serial
                                                        </p>

                                                        <p>
                                                            {orden.serial || "Sin serial"}
                                                        </p>
                                                    </div>


                                                    <div>
                                                        <p className="text-xs text-gray-500">
                                                            Estado
                                                        </p>

                                                        {esTecnico ? (

                                                            <select
                                                                value={orden.estado || ""}
                                                                onChange={(e) =>
                                                                    cambiarEstado(
                                                                        orden,
                                                                        e.target.value
                                                                    )
                                                                }
                                                                className="border border-gray-300 rounded-lg px-2 py-1 text-sm bg-white"
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

                                                    </div>


                                                    <div>
                                                        <p className="text-xs text-gray-500">
                                                            Técnico
                                                        </p>

                                                        <p>
                                                            {orden.tecnicoAsignado?.nombre ||
                                                                "Sin asignar"}
                                                        </p>
                                                    </div>


                                                    <div>
                                                        <p className="text-xs text-gray-500">
                                                            Fecha
                                                        </p>

                                                        <p className="text-gray-600">
                                                            {formatearFecha(
                                                                orden.createdAt
                                                            )}
                                                        </p>
                                                    </div>

                                                </div>


                                                {/* PROBLEMA */}

                                                <div className="mt-4">

                                                    <p className="text-xs text-gray-500">
                                                        Problema reportado
                                                    </p>

                                                    <p className="text-sm text-gray-700">
                                                        {orden.problemaReportado ||
                                                            "Sin información"}
                                                    </p>

                                                </div>


                                                {/* ACCIONES */}

                                                <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-gray-100">

                                                    {/* VER */}

                                                    <button
                                                        onClick={() =>
                                                            navigate(
                                                                `/ordenServicio/${orden._id}`
                                                            )
                                                        }
                                                        className="
    bg-emerald-500 hover:bg-emerald-600
    text-white px-4 py-2
    rounded-lg
    text-sm font-medium
    transition-colors
"                                                    >
                                                        Ver
                                                    </button>


                                                    {/* ELIMINAR */}

                                                    {!esTecnico && (

                                                        <button
                                                            onClick={() =>
                                                                handleEliminar(
                                                                    orden._id
                                                                )
                                                            }
                                                            className="
    bg-red-500 hover:bg-red-600
    text-white px-4 py-2
    rounded-lg
    text-sm font-medium
    transition-colors
"                                                        >
                                                            Eliminar
                                                        </button>

                                                    )}


                                                    {/* PDF */}

                                                    {!esTecnico && (

                                                        <button
                                                            onClick={() =>
                                                                generarOrdenPDF(
                                                                    orden
                                                                )
                                                            }
                                                            className="
    bg-blue-500 hover:bg-blue-600
    text-white px-4 py-2
    rounded-lg
    text-sm font-medium
    transition-colors
"                                                        >
                                                            PDF
                                                        </button>

                                                    )}

                                                </div>

                                            </div>

                                        ))}

                                    </div>

                                )}

                            </div>
                        );

                    })

                ) : (

                    <div className="bg-white rounded-lg border">

                        <div className="flex flex-col items-center justify-center py-16">

                            <ClipboardList
                                size={60}
                                className="text-gray-400"
                            />

                            <p className="text-xl font-semibold mt-4">
                                No hay órdenes registradas
                            </p>

                            <p className="text-gray-400">
                                Presione "Crear Orden de Servicio"
                            </p>

                        </div>

                    </div>

                )}

            </div>

            <Paginacion
                paginaActual={paginaActual}
                totalPaginas={totalPaginas}
                cambiarPagina={setPaginaActual}
                totalRegistros={ordenesPorCliente.length}
                registrosPorPagina={registrosPorPagina}
            />

        </div>
    );

};