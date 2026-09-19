import { useState, Fragment } from "react";
import toast from "react-hot-toast";
import { ClipboardList } from "lucide-react";
import { BadgeEstado } from "../components/ui/BadgeEstado";
import { SearchBar } from "../components/ui/SearchBar";
import { useNavigate } from "react-router-dom";
import { asignarTecnico } from "../api/usuarios.api";

export const UltimasOrdenes = ({
    ordenes = [],
    tecnicos = [],
    onEditar,
    onEliminar,
    onOrdenActualizada
}) => {

    const [buscar, setBuscar] = useState("");
    const [tecnicosSeleccionados, setTecnicosSeleccionados] = useState({});
    const [clienteExpandido, setClienteExpandido] = useState(null);

    const navigate = useNavigate();

    // ================================
    // CAMBIO DE TÉCNICO
    // ================================

    const handleTecnicoChange = (ordenId, tecnicoId) => {

        setTecnicosSeleccionados((prev) => ({
            ...prev,
            [ordenId]: tecnicoId
        }));

    };

    // ================================
    // ASIGNAR TÉCNICO
    // ================================

    const handleAsignarTecnico = async (ordenId, tecnicoId) => {

        if (!tecnicoId) return;

        try {

            const response = await asignarTecnico(
                ordenId,
                tecnicoId
            );

            toast.success(
                response.message ||
                "Técnico asignado correctamente."
            );

            if (onOrdenActualizada) {
                onOrdenActualizada();
            }

        } catch (error) {

            console.error(
                "Error al asignar técnico:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "No se pudo asignar el técnico."
            );

        }

    };

    // ================================
    // FORMATEAR FECHA
    // ================================

    const formatearFecha = (fecha) => {

        if (!fecha) return "";

        const fechaObj = new Date(fecha);

        const dia = String(
            fechaObj.getDate()
        ).padStart(2, "0");

        const mes = String(
            fechaObj.getMonth() + 1
        ).padStart(2, "0");

        const ano = fechaObj.getFullYear();

        return `${dia}/${mes}/${ano}`;

    };

    // ================================
    // ÚLTIMAS 10 ÓRDENES
    // ================================

    const ultimasCinco = ordenes.slice(0, 10);

    // ================================
    // FILTRAR
    // ================================

    const ordenesFiltradas = ordenes.filter((orden) => {

        const texto = buscar.toLowerCase();

        return (

            orden.numeroOrden
                ?.toLowerCase()
                .includes(texto) ||

            orden.cliente?.nombre
                ?.toLowerCase()
                .includes(texto) ||

            orden.cliente?.telefono
                ?.toLowerCase()
                .includes(texto) ||

            orden.marca
                ?.toLowerCase()
                .includes(texto) ||

            orden.modelo
                ?.toLowerCase()
                .includes(texto) ||

            orden.estado
                ?.toLowerCase()
                .includes(texto)

        );

    });

    // ================================
    // QUÉ MOSTRAR
    // ================================

    const ordenesMostrar =
        buscar.trim() === ""
            ? ultimasCinco
            : ordenesFiltradas;

    // ================================
    // AGRUPAR POR CLIENTE
    // ================================

    const ordenesPorCliente = ordenesMostrar.reduce(
        (acumulador, orden) => {

            const idCliente = orden.cliente?._id;

            if (!idCliente) {
                return acumulador;
            }

            const clienteExistente = acumulador.find(
                (item) =>
                    item.cliente._id === idCliente
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

        },
        []
    );

    return (

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mt-6 overflow-hidden">

            {/* ================================
                ENCABEZADO
            ================================= */}

            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 px-6 py-5 border-b border-gray-100 bg-white">

                <div>

                    <p className="font-semibold text-gray-800 text-lg">
                        Últimas Órdenes de Servicio
                    </p>

                    <p className="text-sm text-gray-400 mt-1">
                        Resumen de las solicitudes más recientes
                    </p>

                </div>

                <div className="w-full md:w-80">

                    <SearchBar
                        placeholder="Buscar orden o cliente..."
                        value={buscar}
                        onChange={(e) =>
                            setBuscar(e.target.value)
                        }
                    />

                </div>

            </div>


            {/* ================================
                CONTENIDO
            ================================= */}

            <div className="p-4 md:p-5 bg-gray-50/60">

                {ordenesMostrar.length > 0 ? (

                    <div className="space-y-3">

                        {ordenesPorCliente.map((grupo) => {

                            const expandido =
                                clienteExpandido ===
                                grupo.cliente._id;

                            return (

                                <Fragment
                                    key={grupo.cliente._id}
                                >

                                    {/* =========================
                                        CLIENTE
                                    ========================== */}

                                    <div
                                        className={`
                                            bg-white
                                            border
                                            border-gray-200
                                            rounded-xl
                                            overflow-hidden
                                            transition-all
                                            duration-200
                                            ${expandido
                                                ? "shadow-sm"
                                                : "shadow-none"
                                            }
                                        `}
                                    >

                                        {/* CABECERA CLIENTE */}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setClienteExpandido(
                                                    expandido
                                                        ? null
                                                        : grupo.cliente._id
                                                )
                                            }
                                            className="
                                                w-full
                                                flex
                                                items-center
                                                justify-between
                                                px-5
                                                py-4
                                                text-left
                                                hover:bg-gray-50
                                                transition
                                            "
                                        >

                                            <div className="flex items-center gap-3">

                                                <span
                                                    className="
                                                        flex
                                                        items-center
                                                        justify-center
                                                        w-7
                                                        h-7
                                                        rounded-full
                                                        bg-blue-50
                                                        text-blue-600
                                                        text-sm
                                                    "
                                                >
                                                    {expandido
                                                        ? "−"
                                                        : "+"}
                                                </span>

                                                <div>

                                                    <div className="flex items-center gap-2">

                                                        <span className="font-semibold text-gray-800">
                                                            {grupo.cliente?.nombre}
                                                        </span>

                                                        <span className="text-sm text-gray-400">
                                                            {grupo.ordenes.length}
                                                            {grupo.ordenes.length === 1
                                                                ? " solicitud"
                                                                : " solicitudes"}
                                                        </span>

                                                    </div>

                                                </div>

                                            </div>

                                            <span className="text-sm text-gray-400">

                                                {grupo.cliente?.telefono}

                                            </span>

                                        </button>


                                        {/* =========================
                                            ÓRDENES DEL CLIENTE
                                        ========================== */}

                                        {expandido && (

                                            <div className="px-4 pb-4 space-y-3">

                                                {grupo.ordenes.map((orden) => (

                                                    <div
                                                        key={orden._id}
                                                        className="
                                                            bg-white
                                                            border
                                                            border-gray-200
                                                            rounded-xl
                                                            p-4
                                                            shadow-sm
                                                            hover:shadow-md
                                                            hover:border-gray-300
                                                            transition-all
                                                            duration-200
                                                        "
                                                    >

                                                        {/* INFORMACIÓN */}

                                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">

                                                            {/* ORDEN */}

                                                            <div>

                                                                <p className="text-xs text-gray-400 mb-1">
                                                                    Orden
                                                                </p>

                                                                <p className="font-semibold text-gray-800">
                                                                    {orden.numeroOrden}
                                                                </p>

                                                            </div>


                                                            {/* TELÉFONO */}

                                                            <div>

                                                                <p className="text-xs text-gray-400 mb-1">
                                                                    Teléfono
                                                                </p>

                                                                <p className="text-gray-700">
                                                                    {orden.cliente?.telefono}
                                                                </p>

                                                            </div>


                                                            {/* EQUIPO */}

                                                            <div>

                                                                <p className="text-xs text-gray-400 mb-1">
                                                                    Equipo
                                                                </p>

                                                                <p className="text-gray-700">
                                                                    {orden.marca} {orden.modelo}
                                                                </p>

                                                            </div>


                                                            {/* SERIAL */}

                                                            <div>

                                                                <p className="text-xs text-gray-400 mb-1">
                                                                    Serial
                                                                </p>

                                                                <p className="text-gray-700">
                                                                    {orden.serial || "Sin serial"}
                                                                </p>

                                                            </div>


                                                            {/* PROBLEMA */}

                                                            <div>

                                                                <p className="text-xs text-gray-400 mb-1">
                                                                    Problema reportado
                                                                </p>

                                                                <p
                                                                    className="text-gray-700 truncate"
                                                                    title={orden.problemaReportado}
                                                                >
                                                                    {orden.problemaReportado ||
                                                                        "Sin información"}
                                                                </p>

                                                            </div>


                                                            {/* ESTADO */}

                                                            <div>

                                                                <p className="text-xs text-gray-400 mb-1">
                                                                    Estado del técnico
                                                                </p>

                                                                <BadgeEstado
                                                                    estado={orden.estado}
                                                                />

                                                            </div>

                                                        </div>


                                                        {/* LÍNEA */}

                                                        <div className="border-t border-gray-100 my-4"></div>


                                                        {/* ACCIONES */}

                                                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">

                                                            {/* FECHA */}

                                                            <div>

                                                                <p className="text-xs text-gray-400 mb-1">
                                                                    Fecha
                                                                </p>

                                                                <p className="text-sm text-gray-500">
                                                                    {formatearFecha(
                                                                        orden.createdAt
                                                                    )}
                                                                </p>

                                                            </div>


                                                            {/* TÉCNICO */}

                                                            <div className="flex flex-col sm:flex-row sm:items-center gap-2">

                                                                <select
                                                                    value={
                                                                        tecnicosSeleccionados[orden._id] ||
                                                                        orden.tecnicoAsignado?._id ||
                                                                        ""
                                                                    }
                                                                    onChange={(e) =>
                                                                        handleTecnicoChange(
                                                                            orden._id,
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                    className="
                                                                        border
                                                                        border-gray-200
                                                                        rounded-lg
                                                                        px-3
                                                                        py-2
                                                                        bg-white
                                                                        text-sm
                                                                        text-gray-700
                                                                        outline-none
                                                                        focus:ring-2
                                                                        focus:ring-blue-100
                                                                        focus:border-blue-300
                                                                        transition
                                                                    "
                                                                >

                                                                    <option value="">
                                                                        Seleccionar técnico
                                                                    </option>

                                                                    {tecnicos.map((tecnico) => (

                                                                        <option
                                                                            key={tecnico._id}
                                                                            value={tecnico._id}
                                                                        >
                                                                            {tecnico.nombre}
                                                                        </option>

                                                                    ))}

                                                                </select>


                                                                {/* ASIGNAR */}

                                                                {(
                                                                    !orden.tecnicoAsignado ||
                                                                    (
                                                                        tecnicosSeleccionados[orden._id] &&
                                                                        tecnicosSeleccionados[orden._id] !==
                                                                        orden.tecnicoAsignado._id
                                                                    )
                                                                ) && (

                                                                        <button
                                                                            onClick={() =>
                                                                                handleAsignarTecnico(
                                                                                    orden._id,
                                                                                    tecnicosSeleccionados[orden._id]
                                                                                )
                                                                            }
                                                                            disabled={
                                                                                !tecnicosSeleccionados[orden._id]
                                                                            }
                                                                            className="
                                                                                bg-blue-600
                                                                                hover:bg-blue-700
                                                                                disabled:bg-gray-200
                                                                                disabled:text-gray-400
                                                                                disabled:cursor-not-allowed
                                                                                text-white
                                                                                px-4
                                                                                py-2
                                                                                rounded-lg
                                                                                text-sm
                                                                                transition
                                                                            "
                                                                        >
                                                                            {orden.tecnicoAsignado
                                                                                ? "Reasignar"
                                                                                : "Asignar"}
                                                                        </button>

                                                                    )}

                                                            </div>


                                                            {/* BOTONES */}

                                                            <div className="flex items-center gap-2">

                                                                {/* VER */}

                                                                <button
                                                                    onClick={() =>
                                                                        navigate(
                                                                            `/ordenServicio/${orden._id}`
                                                                        )
                                                                    }
                                                                    className="
                                                                        bg-emerald-600
                                                                        hover:bg-emerald-700
                                                                        text-white
                                                                        px-4
                                                                        py-2
                                                                        rounded-lg
                                                                        text-sm
                                                                        transition
                                                                    "
                                                                >
                                                                    Ver
                                                                </button>


                                                                {/* ELIMINAR */}

                                                                <button
                                                                    onClick={() =>
                                                                        onEliminar?.(orden._id)
                                                                    }
                                                                    className="
                                                                        bg-red-500
                                                                        hover:bg-red-600
                                                                        text-white
                                                                        px-4
                                                                        py-2
                                                                        rounded-lg
                                                                        text-sm
                                                                        transition
                                                                    "
                                                                >
                                                                    Eliminar
                                                                </button>

                                                            </div>

                                                        </div>

                                                    </div>

                                                ))}

                                            </div>

                                        )}

                                    </div>

                                </Fragment>

                            );

                        })}

                    </div>

                ) : (

                    /* ================================
                       SIN ÓRDENES
                    ================================= */

                    <div className="flex flex-col items-center justify-center py-16">

                        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">

                            <ClipboardList
                                size={32}
                                className="text-gray-400"
                            />

                        </div>

                        <p className="text-lg font-semibold text-gray-700">
                            No hay órdenes registradas
                        </p>

                        <p className="text-sm text-gray-400 mt-1">
                            Presione "Crear Orden de Servicio"
                        </p>

                    </div>

                )}

            </div>

        </div>

    );

};