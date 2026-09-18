import { useState, Fragment } from "react";
import toast from "react-hot-toast";
import { Pencil, ClipboardList } from "lucide-react";
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

    // --------------------------------
    // CAMBIO DE TÉCNICO SELECCIONADO
    // --------------------------------

    const handleTecnicoChange = (ordenId, tecnicoId) => {

        setTecnicosSeleccionados((prev) => ({
            ...prev,
            [ordenId]: tecnicoId
        }));

    };


    // --------------------------------
    // ASIGNAR TÉCNICO
    // --------------------------------

    const handleAsignarTecnico = async (ordenId, tecnicoId) => {

        if (!tecnicoId) {
            return;
        }

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


    // --------------------------------
    // FORMATEAR FECHA
    // --------------------------------

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


    // --------------------------------
    // ÚLTIMAS 5 ÓRDENES
    // --------------------------------

    const ultimasCinco = ordenes.slice(0, 10);


    // --------------------------------
    // FILTRAR ÓRDENES
    // --------------------------------

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


    // --------------------------------
    // QUÉ ÓRDENES MOSTRAR
    // --------------------------------

    const ordenesMostrar =
        buscar.trim() === ""
            ? ultimasCinco
            : ordenesFiltradas;


    // --------------------------------
    // AGRUPAR POR CLIENTE
    // --------------------------------

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

        <div className="bg-white rounded-lg shadow mt-6">

            {/* ENCABEZADO */}

            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 p-4 border-b">

                <p className="font-bold p-4 border-b">
                    Últimas Órdenes de Servicio
                </p>

                <SearchBar
                    placeholder="Buscar orden o cliente..."
                    value={buscar}
                    onChange={(e) =>
                        setBuscar(e.target.value)
                    }
                />

            </div>


            {/* TABLA */}

            <div className="overflow-x-auto">

                <table className="min-w-[1450px] w-full border-collapse">

                    {/* ENCABEZADOS */}

                    <thead className="bg-gray-100">

                        <tr>

                            <th className="px-4 py-3 text-left whitespace-nowrap">
                                Orden
                            </th>

                            <th className="px-4 py-3 text-left whitespace-nowrap">
                                Cliente
                            </th>

                            <th className="px-4 py-3 text-left whitespace-nowrap">
                                Teléfono
                            </th>

                            <th className="px-4 py-3 text-left whitespace-nowrap">
                                Equipo
                            </th>

                            <th className="px-4 py-3 text-left whitespace-nowrap">
                                Serial
                            </th>

                            <th className="px-4 py-3 text-left whitespace-nowrap">
                                Daño reportado
                            </th>

                            <th className="px-4 py-3 text-left whitespace-nowrap">
                                Estado
                            </th>

                            <th className="px-4 py-3 text-left whitespace-nowrap">
                                Técnico
                            </th>

                            <th className="px-4 py-3 text-left whitespace-nowrap">
                                Fecha
                            </th>

                            <th className="px-4 py-3 text-left whitespace-nowrap">
                                Ver
                            </th>

                        </tr>

                    </thead>


                    {/* CUERPO */}

                    <tbody>

                        {ordenesMostrar.length > 0 ? (

                            ordenesPorCliente.map((grupo) => {

                                /*
                                Tomamos la primera orden del grupo
                                para representar al cliente en la
                                fila principal.
                                */

                                const ordenPrincipal =
                                    grupo.ordenes[0];

                                return (

                                    <Fragment
                                        key={grupo.cliente._id}
                                    >

                                        {/* =========================
                                            FILA PRINCIPAL DEL CLIENTE
                                        ========================== */}

                                        <tr className="hover:bg-gray-50">

                                            {/* ORDEN */}

                                            <td className="px-4 py-3">

                                                {ordenPrincipal?.numeroOrden ||
                                                    "Sin orden"}

                                            </td>


                                            {/* CLIENTE */}

                                            <td className="px-4 py-3">

                                                <div className="flex items-center gap-2">

                                                    <button
                                                        onClick={() =>
                                                            setClienteExpandido(
                                                                clienteExpandido ===
                                                                    grupo.cliente._id
                                                                    ? null
                                                                    : grupo.cliente._id
                                                            )
                                                        }
                                                        className="text-blue-600 font-bold"
                                                    >

                                                        {clienteExpandido ===
                                                        grupo.cliente._id
                                                            ? "▼"
                                                            : "▶"}

                                                    </button>

                                                    <span>
                                                        {grupo.cliente?.nombre}
                                                    </span>

                                                    <span className="text-gray-500">

                                                        {grupo.ordenes.length}

                                                        {grupo.ordenes.length === 1
                                                            ? " solicitud"
                                                            : " solicitudes"}

                                                    </span>

                                                </div>

                                            </td>


                                            {/* TELÉFONO */}

                                            <td className="px-4 py-3">

                                                {grupo.cliente?.telefono}

                                            </td>


                                            {/* EQUIPO */}

                                            <td className="px-4 py-3">

                                                <div className="font-medium">

                                                    {ordenPrincipal?.marca}{" "}
                                                    {ordenPrincipal?.modelo}

                                                </div>

                                                <div className="text-sm text-gray-500">

                                                    {ordenPrincipal?.tipoEquipo}

                                                </div>

                                            </td>


                                            {/* SERIAL */}

                                            <td className="px-4 py-3">

                                                {ordenPrincipal?.serial ||
                                                    "Sin serial"}

                                            </td>


                                            {/* DAÑO */}

                                            <td className="px-4 py-3 max-w-xs">

                                                <p
                                                    className="truncate"
                                                    title={
                                                        ordenPrincipal?.problemaReportado
                                                    }
                                                >

                                                    {ordenPrincipal?.problemaReportado ||
                                                        "Sin información"}

                                                </p>

                                            </td>


                                            {/* ESTADO */}

                                            <td className="px-4 py-3">

                                                <BadgeEstado
                                                    estado={
                                                        ordenPrincipal?.estado
                                                    }
                                                />

                                            </td>


                                            {/* TÉCNICO */}

                                            <td className="px-4 py-3">

                                                <select
                                                    value={
                                                        tecnicosSeleccionados[
                                                            ordenPrincipal?._id
                                                        ] ||
                                                        ordenPrincipal?.tecnicoAsignado?._id ||
                                                        ""
                                                    }
                                                    onChange={(e) =>
                                                        handleTecnicoChange(
                                                            ordenPrincipal._id,
                                                            e.target.value
                                                        )
                                                    }
                                                    className="border border-gray-300 rounded-lg px-3 py-2 bg-white w-48 text-sm"
                                                >

                                                    <option value="">
                                                        Seleccionar técnico
                                                    </option>

                                                    {tecnicos.map(
                                                        (tecnico) => (

                                                            <option
                                                                key={
                                                                    tecnico._id
                                                                }
                                                                value={
                                                                    tecnico._id
                                                                }
                                                            >

                                                                {
                                                                    tecnico.nombre
                                                                }

                                                            </option>

                                                        )
                                                    )}

                                                </select>


                                                {(
                                                    !ordenPrincipal?.tecnicoAsignado ||

                                                    (
                                                        tecnicosSeleccionados[
                                                            ordenPrincipal?._id
                                                        ] &&

                                                        tecnicosSeleccionados[
                                                            ordenPrincipal?._id
                                                        ] !==
                                                            ordenPrincipal?.tecnicoAsignado?._id
                                                    )

                                                ) && (

                                                    <button
                                                        onClick={() =>
                                                            handleAsignarTecnico(
                                                                ordenPrincipal._id,
                                                                tecnicosSeleccionados[
                                                                    ordenPrincipal._id
                                                                ]
                                                            )
                                                        }
                                                        disabled={
                                                            !tecnicosSeleccionados[
                                                                ordenPrincipal._id
                                                            ]
                                                        }
                                                        className="mt-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-3 py-1.5 rounded-lg text-sm transition"
                                                    >

                                                        {ordenPrincipal?.tecnicoAsignado
                                                            ? "Reasignar"
                                                            : "Asignar"}

                                                    </button>

                                                )}

                                            </td>


                                            {/* FECHA */}

                                            <td className="px-4 py-3">

                                                {formatearFecha(
                                                    ordenPrincipal?.createdAt
                                                )}

                                            </td>


                                            {/* VER */}

                                            <td className="px-4 py-3">

                                                <button
                                                    onClick={() =>
                                                        navigate(
                                                            `/ordenServicio/${ordenPrincipal._id}`
                                                        )
                                                    }
                                                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg shadow transition"
                                                >

                                                    <Pencil size={18} />

                                                </button>

                                            </td>

                                        </tr>


                                        {/* =========================
                                            SOLICITUDES DEL CLIENTE
                                        ========================== */}

                                        {clienteExpandido ===
                                            grupo.cliente._id && (

                                            <tr>

                                                <td
                                                    colSpan={10}
                                                    className="px-6 py-4 bg-gray-50"
                                                >

                                                    <div className="space-y-2">

                                                        {grupo.ordenes.map(
                                                            (orden) => (

                                                                <div
                                                                    key={
                                                                        orden._id
                                                                    }
                                                                    className="flex items-center justify-between gap-4 p-3 bg-white rounded-lg border hover:bg-gray-50"
                                                                >

                                                                    {/* INFORMACIÓN */}

                                                                    <div className="flex items-center gap-6">

                                                                        <span className="font-semibold">

                                                                            {
                                                                                orden.numeroOrden
                                                                            }

                                                                        </span>

                                                                        <span>

                                                                            {
                                                                                orden.marca
                                                                            }{" "}

                                                                            {
                                                                                orden.modelo
                                                                            }

                                                                        </span>

                                                                        <BadgeEstado
                                                                            estado={
                                                                                orden.estado
                                                                            }
                                                                        />

                                                                        <span className="text-gray-500">

                                                                            {
                                                                                formatearFecha(
                                                                                    orden.createdAt
                                                                                )
                                                                            }

                                                                        </span>

                                                                    </div>


                                                                    {/* VER ORDEN */}

                                                                    <button
                                                                        onClick={() =>
                                                                            navigate(
                                                                                `/ordenServicio/${orden._id}`
                                                                            )
                                                                        }
                                                                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg"
                                                                    >

                                                                        Ver

                                                                    </button>

                                                                </div>

                                                            )
                                                        )}

                                                    </div>

                                                </td>

                                            </tr>

                                        )}

                                    </Fragment>

                                );

                            })

                        ) : (

                            /* =========================
                               SIN ÓRDENES
                            ========================== */

                            <tr>

                                <td colSpan={10}>

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

        </div>

    );

};