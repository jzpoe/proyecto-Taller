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

        const idCliente = orden.cliente?._id;

        if (!idCliente) {
            return acumulador;
        }

        const clienteExistente = acumulador.find(
            (item) => item.cliente._id === idCliente
        );

        if (clienteExistente) {

            clienteExistente.ordenes.push(orden);

        } else {

            acumulador.push({
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

            <div className="overflow-x-auto">

                <table className="w-full min-w-[1500px] border-collapse">

                    <thead className="bg-gray-100">
                        {/* tus th */}
                    </thead>

                    <tbody>

                        {ordenesFiltradas.length > 0 ? (

                            clientesPaginados.map((grupo) => {

                                const ordenPrincipal = grupo.ordenes[0];

                                return (
                                    <Fragment key={grupo.cliente._id}>

                                        {/* FILA DEL CLIENTE */}
                                        <tr className="hover:bg-gray-50">

                                            <td className="px-4 py-3">
                                                {ordenPrincipal?.numeroOrden || "Sin orden"}
                                            </td>

                                            <td className="px-4 py-3">

                                                <div className="flex items-center gap-2">

                                                    <button
                                                        onClick={() =>
                                                            setClienteExpandido(
                                                                clienteExpandido === grupo.cliente._id
                                                                    ? null
                                                                    : grupo.cliente._id
                                                            )
                                                        }
                                                        className="text-blue-600 font-bold"
                                                    >
                                                        {clienteExpandido === grupo.cliente._id
                                                            ? "▼"
                                                            : "▶"}
                                                    </button>

                                                    <span>
                                                        {grupo.cliente?.nombre}
                                                    </span>

                                                    <span className="text-gray-500">
                                                        {grupo.ordenes.length} solicitudes
                                                    </span>

                                                </div>

                                            </td>

                                            <td className="px-4 py-3">
                                                {grupo.cliente?.telefono}
                                            </td>

                                            <td className="px-4 py-3">
                                                {ordenPrincipal?.marca} {ordenPrincipal?.modelo}
                                            </td>

                                            <td className="px-4 py-3">
                                                {ordenPrincipal?.serial || "Sin serial"}
                                            </td>

                                            <td className="px-4 py-3">
                                                {ordenPrincipal?.problemaReportado || "Sin información"}
                                            </td>

                                            <td className="px-4 py-3">

                                                {esTecnico ? (
                                                    <select
                                                        value={ordenPrincipal?.estado || ""}
                                                        onChange={(e) =>
                                                            cambiarEstado(
                                                                ordenPrincipal,
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
                                                        estado={ordenPrincipal?.estado}
                                                    />
                                                )}

                                            </td>

                                            <td className="px-4 py-3">
                                                {ordenPrincipal?.tecnicoAsignado?.nombre || "Sin asignar"}
                                            </td>

                                            <td className="px-4 py-3">
                                                {formatearFecha(ordenPrincipal?.createdAt)}
                                            </td>

                                            <td className="px-4 py-3 text-center">
                                                <button
                                                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg shadow transition"
                                                    onClick={() =>
                                                        navigate(
                                                            `/ordenServicio/${ordenPrincipal._id}`
                                                        )
                                                    }
                                                >
                                                    Ver
                                                </button>
                                            </td>

                                            {!esTecnico && (
                                                <td className="px-4 py-3 text-center">
                                                    <button
                                                        onClick={() =>
                                                            handleEliminar(ordenPrincipal._id)
                                                        }
                                                        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg shadow transition"
                                                    >
                                                        <Trash size={20} />
                                                    </button>
                                                </td>
                                            )}

                                            {!esTecnico && (
                                                <td className="px-4 py-3 text-center">
                                                    <button
                                                        onClick={() =>
                                                            generarOrdenPDF(ordenPrincipal)
                                                        }
                                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                                                    >
                                                        PDF
                                                    </button>
                                                </td>
                                            )}

                                        </tr>


                                        {/* SOLICITUDES DEL CLIENTE */}
                                        {clienteExpandido === grupo.cliente._id && (

                                            <tr>

                                                <td
                                                    colSpan={esTecnico ? 10 : 12}
                                                    className="px-6 py-4 bg-gray-50"
                                                >

                                                    <div className="space-y-2">

                                                        {grupo.ordenes.map((orden) => (

                                                            <div
                                                                key={orden._id}
                                                                className="flex items-center justify-between p-3 bg-white rounded-lg border hover:bg-gray-50"
                                                            >

                                                                <div className="flex items-center gap-6">

                                                                    <span className="font-semibold">
                                                                        {orden.numeroOrden}
                                                                    </span>

                                                                    <span>
                                                                        {orden.marca} {orden.modelo}
                                                                    </span>

                                                                    <span>
                                                                        {orden.estado}
                                                                    </span>

                                                                    <span>
                                                                        {formatearFecha(orden.createdAt)}
                                                                    </span>

                                                                </div>

                                                                <button
                                                                    onClick={() =>
                                                                        navigate(`/ordenServicio/${orden._id}`)
                                                                    }
                                                                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg"
                                                                >
                                                                    Ver
                                                                </button>

                                                            </div>

                                                        ))}

                                                    </div>

                                                </td>

                                            </tr>

                                        )}

                                    </Fragment>
                                );
                            })

                        ) : (

                            <tr>

                                <td colSpan={esTecnico ? 10 : 12}>

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

                        )}

                    </tbody>

                </table>

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