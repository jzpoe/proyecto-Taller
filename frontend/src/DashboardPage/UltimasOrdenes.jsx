import { useState } from "react";
import toast from "react-hot-toast";
import { Pencil, Trash, ClipboardList } from "lucide-react";
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
    const navigate = useNavigate();


    const handleTecnicoChange = (ordenId, tecnicoId) => {

        setTecnicosSeleccionados((prev) => ({
            ...prev,
            [ordenId]: tecnicoId
        }));

    };

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
                response.message || "Técnico asignado correctamente."
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

    const formatearFecha = (fecha) => {

        if (!fecha) return "";

        const fechaObj = new Date(fecha);

        const dia = String(fechaObj.getDate()).padStart(2, "0");
        const mes = String(fechaObj.getMonth() + 1).padStart(2, "0");
        const ano = fechaObj.getFullYear();

        return `${dia}/${mes}/${ano}`;

    };

    const ultimasCinco = ordenes.slice(0, 6);

    const ordenesFiltradas = ordenes.filter((orden) => {

        const texto = buscar.toLowerCase();



        return (

            orden.numeroOrden?.toLowerCase().includes(texto) ||

            orden.cliente?.nombre?.toLowerCase().includes(texto) ||

            orden.cliente?.telefono?.toLowerCase().includes(texto) ||

            orden.marca?.toLowerCase().includes(texto) ||

            orden.modelo?.toLowerCase().includes(texto) ||

            orden.estado?.toLowerCase().includes(texto)

        );

    });

    const ordenesMostrar =
        buscar.trim() === ""
            ? ultimasCinco
            : ordenesFiltradas;

    return (

        <div className="bg-white rounded-lg shadow mt-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 p-4 border-b">

                <p className="font-bold p-4 border-b">

                    Últimas Órdenes de Servicio

                </p>

                <SearchBar

                    placeholder="Buscar orden o cliente..."

                    value={buscar}

                    onChange={(e) => setBuscar(e.target.value)}

                />

            </div>
            <div className="overflow-x-auto">

                <table className="min-w-[1450px] w-full border-collapse">
                    <thead className="bg-gray-100">

                        <tr>

                            <th className="px-4 py-3 text-left whitespace-nowrap">Orden</th>

                            <th className="px-4 py-3 text-left whitespace-nowrap">Cliente</th>

                            <th className="px-4 py-3 text-left whitespace-nowrap">Teléfono</th>

                            <th className="px-4 py-3 text-left whitespace-nowrap">Equipo</th>

                            <th className="px-4 py-3 text-left whitespace-nowrap">Serial</th>

                            <th className="px-4 py-3 text-left whitespace-nowrap">Daño reportado</th>
                            <th className="px-4 py-3 text-left whitespace-nowrap">Estado</th>
                            <th className="px-4 py-3 text-left whitespace-nowrap">
                                Técnico
                            </th>

                            <th className="px-4 py-3 text-left whitespace-nowrap">Fecha</th>

                            <th className="px-4 py-3 text-left whitespace-nowrap">Ver</th>

                            {/* <th className="px-4 py-3 text-left">Eliminar</th> */}

                        </tr>



                    </thead>

                    <tbody>

                        {

                            ordenesMostrar.length > 0

                                ?

                                ordenesMostrar.map((orden) => (

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

                                            <div className="font-medium">
                                                {orden.marca} {orden.modelo}
                                            </div>

                                            <div className="text-sm text-gray-500">
                                                {orden.tipoEquipo}
                                            </div>

                                        </td>

                                        <td className="px-4 py-3">

                                            {orden.serial || "Sin serial"}

                                        </td>

                                        <td className="px-4 py-3 max-w-xs">

                                            <p
                                                className="truncate"
                                                title={orden.problemaReportado}
                                            >
                                                {orden.problemaReportado || "Sin información"}
                                            </p>

                                        </td>

                                        <td className="px-4 py-3">

                                            <BadgeEstado

                                                estado={orden.estado}

                                            />

                                        </td>

                                        <td className="px-4 py-3">

                                            <select
                                                value={
                                                    tecnicosSeleccionados[orden._id] ||
                                                    orden.tecnicoAsignado?._id ||
                                                    ""
                                                } onChange={(e) =>
                                                    handleTecnicoChange(
                                                        orden._id,
                                                        e.target.value
                                                    )
                                                }
                                                className="border border-gray-300 rounded-lg px-3 py-2 bg-white w-48 text-sm"                                            >

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
                                            {(
                                                !orden.tecnicoAsignado ||
                                                (
                                                    tecnicosSeleccionados[orden._id] &&
                                                    tecnicosSeleccionados[orden._id] !== orden.tecnicoAsignado._id
                                                )
                                            ) && (

                                                    <button
                                                        onClick={() =>
                                                            handleAsignarTecnico(
                                                                orden._id,
                                                                tecnicosSeleccionados[orden._id]
                                                            )
                                                        }
                                                        disabled={!tecnicosSeleccionados[orden._id]}
                                                        className="mt-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-3 py-1.5 rounded-lg text-sm transition"
                                                    >
                                                        {
                                                            orden.tecnicoAsignado
                                                                ? "Reasignar"
                                                                : "Asignar"
                                                        }
                                                    </button>

                                                )}

                                        </td>

                                        <td className="px-4 py-3">

                                            {formatearFecha(orden.createdAt)}

                                        </td>

                                        <td>

                                            {/* <button

                                                onClick={() =>  onEditar?.(orden)}

                                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-200 hover:scale-105"

                                            >

                                                <Pencil size={18} />

                                            </button> */}

                                            <button
                                                onClick={() => navigate(`/ordenServicio/${orden._id}`)}
                                                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg shadow transition"
                                            >
                                                <Pencil size={18} />
                                            </button>

                                        </td>

                                        <td>

                                            {/* <button

                                                onClick={() => onEliminar?.(orden._id)}

                                                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-200 hover:scale-105"

                                            >

                                                <Trash size={18} />

                                            </button> */}

                                        </td>

                                    </tr>

                                ))

                                :

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

                        }

                    </tbody>

                </table>

            </div>

        </div>


    );

};