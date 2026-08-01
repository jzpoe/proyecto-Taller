import { UserRound } from "lucide-react";


export const EquipoDetalles = ({ orden }) => {

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">

            <div className="flex items-center gap-3 border-b pb-4">

                <UserRound
                    className="text-blue-700"
                    size={28}
                />

                <h2 className="text-xl font-bold text-gray-800">

                    Equipo

                </h2>

            </div>

            <div className="space-y-4 mt-5">

                <div>

                    <p className="text-sm text-gray-500">

                        Tipo de Equipo

                    </p>

                    <p className="font-semibold">

                        {orden.tipoEquipo}

                    </p>

                </div>
                <h2 className="text-sm text-gray-500">

                    Marca

                </h2>
                <p className="font-semibold">

                    {orden.marca}

                </p>
                <div>

                    <p className="text-sm text-gray-500">

                        Serial

                    </p>

                    <p className="font-semibold">

                        {orden.serial}

                    </p>

                </div>

                <div>

                    <p className="text-sm text-gray-500">

                        Modelo

                    </p>

                    <p className="font-semibold">

                        {orden.modelo || "No registrado"}

                    </p>

                </div>

            </div>

        </div>

    );

};

