import { useState } from "react";
import { Pencil, Trash, ClipboardList } from "lucide-react";
import { BadgeEstado } from "../components/ui/BadgeEstado";
import { SearchBar } from "../components/ui/SearchBar";

export const UltimasOrdenes = ({
    ordenes = [],
    onEditar,
    onEliminar
}) => {


    const [buscar, setBuscar] = useState("");



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

                <table className="min-w-[1000px] w-full border-collapse">

                    <thead className="bg-gray-100">

                        <tr>

                            <th className="px-4 py-3 text-left">Orden</th>

                            <th className="px-4 py-3 text-left">Cliente</th>

                            <th className="px-4 py-3 text-left">Teléfono</th>

                            <th className="px-4 py-3 text-left">Equipo</th>

                            <th className="px-4 py-3 text-left">Estado</th>

                            <th className="px-4 py-3 text-left">Fecha</th>

                            <th className="px-4 py-3 text-left">Editar</th>

                            <th className="px-4 py-3 text-left">Eliminar</th>

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

                                            {orden.marca} {orden.modelo}

                                        </td>

                                        <td className="px-4 py-3">

                                            <BadgeEstado

                                                estado={orden.estado}

                                            />

                                        </td>

                                        <td className="px-4 py-3">

                                            {formatearFecha(orden.createdAt)}

                                        </td>

                                        <td>

                                            <button

                                                onClick={() => onEditar?.(orden)}

                                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-200 hover:scale-105"

                                            >

                                                <Pencil size={18} />

                                            </button>

                                        </td>

                                        <td>

                                            <button

                                                onClick={() => onEliminar?.(orden._id)}

                                                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-200 hover:scale-105"

                                            >

                                                <Trash size={18} />

                                            </button>

                                        </td>

                                    </tr>

                                ))

                                :

                                <tr>

                                    <td colSpan={8}>

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