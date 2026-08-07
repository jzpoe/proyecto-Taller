import { UserRound } from "lucide-react";
import { Input } from "../ui/Input";

export const ClienteCard = ({ cliente, handleChange }) => {

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

                    <Input
                        label="Nombre"
                        name="nombre"
                        value={cliente.nombre}
                        onChange={handleChange}
                    />

                </div>

                <div>

                    <p className="text-sm text-gray-500">

                        Teléfono

                    </p>

                    <Input
                        label="Teléfono"
                        name="telefono"
                        value={cliente.telefono || ""}
                        onChange={handleChange}
                    />

                </div>

                <div>

                    <p className="text-sm text-gray-500">

                        Correo

                    </p>

                    <Input
                        label="Correo"
                        name="correo"
                        value={cliente.correo || ""}
                        onChange={handleChange}
                    />

                </div>

            </div>

        </div>

    );

};