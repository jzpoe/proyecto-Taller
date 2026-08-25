import { useEffect, useState } from "react";
import { obtenerMisOrdenes } from "../api/usuarios.api";

export const TecnicoDashboard = () => {

    const [ordenes, setOrdenes] = useState([]);

    const cargarOrdenes = async () => {

        try {

            const response = await obtenerMisOrdenes();

            setOrdenes(response.ordenes);

        } catch (error) {

            console.error(
                "Error al cargar mis órdenes:",
                error
            );

        }

    };

    useEffect(() => {

        cargarOrdenes();

    }, []);

    return (

        <div>

            <h1 className="text-2xl font-bold text-gray-800">
                Mis Órdenes de Servicio
            </h1>

            <p className="text-gray-500 mt-1 mb-6">
                Órdenes asignadas a ti
            </p>

            <div className="bg-white rounded-lg shadow overflow-hidden">

                <div className="overflow-x-auto">

                    <table className="min-w-full">

                        <thead className="bg-gray-100">

                            <tr>

                                <th className="px-4 py-3 text-left">
                                    Orden
                                </th>

                                <th className="px-4 py-3 text-left">
                                    Cliente
                                </th>

                                <th className="px-4 py-3 text-left">
                                    Equipo
                                </th>

                                <th className="px-4 py-3 text-left">
                                    Serial
                                </th>

                                <th className="px-4 py-3 text-left">
                                    Problema
                                </th>

                                <th className="px-4 py-3 text-left">
                                    Estado
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {ordenes.map((orden) => (

                                <tr
                                    key={orden._id}
                                    className="border-t hover:bg-gray-50"
                                >

                                    <td className="px-4 py-3">
                                        {orden.numeroOrden}
                                    </td>

                                    <td className="px-4 py-3">
                                        {orden.cliente?.nombre}
                                    </td>

                                    <td className="px-4 py-3">
                                        {orden.marca} {orden.modelo}
                                    </td>

                                    <td className="px-4 py-3">
                                        {orden.serial || "Sin serial"}
                                    </td>

                                    <td className="px-4 py-3">
                                        {orden.problemaReportado}
                                    </td>

                                    <td className="px-4 py-3">
                                        {orden.estado}
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    );

};