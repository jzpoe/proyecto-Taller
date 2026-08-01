import { UserRound } from "lucide-react";

export const ClienteCard = ({ cliente }) => {

    return (

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">

            <div className="flex items-center gap-3 border-b pb-4">

                <UserRound
                    className="text-blue-700"
                    size={28}
                />

                <h2 className="text-xl font-bold text-gray-800">

                    Cliente

                </h2>

            </div>

            <div className="space-y-4 mt-5">

                <div>

                    <p className="text-sm text-gray-500">

                        Nombre

                    </p>

                    <p className="font-semibold">

                        {cliente.nombre}

                    </p>

                </div>

                <div>

                    <p className="text-sm text-gray-500">

                        Teléfono

                    </p>

                    <p className="font-semibold">

                        {cliente.telefono}

                    </p>

                </div>

                <div>

                    <p className="text-sm text-gray-500">

                        Correo

                    </p>

                    <p className="font-semibold">

                        {cliente.correo || "No registrado"}

                    </p>

                </div>

            </div>

        </div>

    );

};