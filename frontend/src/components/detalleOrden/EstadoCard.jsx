import { ClipboardList } from "lucide-react";
import { BadgeEstado } from "../ui/BadgeEstado";

export const EstadoCard = ({ orden }) => {

    const formatearFecha = (fecha) => {

        if (!fecha) return "";

        return new Date(fecha).toLocaleDateString("es-CO", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });

    };

    return (

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">

            <div className="flex justify-between items-center border-b pb-4">

                <div className="flex items-center gap-3">

                    <ClipboardList
                        size={30}
                        className="text-blue-700"
                    />

                    <h2 className="text-2xl font-bold text-gray-800">

                        Orden de Servicio

                    </h2>

                </div>

                <BadgeEstado estado={orden.estado} />

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

                <div>

                    <p className="text-gray-500 text-sm">
                        Número de Orden
                    </p>

                    <p className="font-bold text-lg">
                        {orden.numeroOrden}
                    </p>

                </div>

                <div>

                    <p className="text-gray-500 text-sm">
                        Fecha de ingreso
                    </p>

                    <p className="font-semibold">
                        {formatearFecha(orden.createdAt)}
                    </p>

                </div>

                <div>

    <p className="text-gray-500 text-sm">
        Fecha de diagnóstico
    </p>

    <p className="font-semibold">
        {orden.fechaDiagnostico
            ? formatearFecha(orden.fechaDiagnostico)
            : "Pendiente"
        }
    </p>

</div>

<div>

    <p className="text-gray-500 text-sm">
        Fecha de entrega
    </p>

    <p className="font-semibold">
        {orden.fechaEntrega
            ? formatearFecha(orden.fechaEntrega)
            : "Pendiente"
        }
    </p>

</div>


                <div>

                    <p className="text-gray-500 text-sm">
                        Última actualización
                    </p>

                    <p className="font-semibold">
                        {formatearFecha(orden.updatedAt)}
                    </p>

                </div>

            </div>

        </div>

    );

};