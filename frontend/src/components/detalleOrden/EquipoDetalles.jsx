import { UserRound } from "lucide-react";
import { Input } from "../ui/Input";


export const EquipoDetalles = ({ orden, handleChange }) => {

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

                    <Input
                       label="Tipo de Equipo"
                       name="tipoEquipo"
                       value={orden.tipoEquipo || ""}
                       onChange={handleChange}
                     />
                   
                </div>
                <h2 className="text-sm text-gray-500">

                    Marca

                </h2>
                  <Input
                       label="Marca"
                       name="marca"
                       value={orden.marca || ""}
                       onChange={handleChange}
                     />
                <div>

                    <p className="text-sm text-gray-500">

                        Serial

                    </p>

                      <Input
                       label="Serial"
                       name="serial"
                       value={orden.serial || ""}
                       onChange={handleChange}
                     />

                </div>

                <div>

                    <p className="text-sm text-gray-500">

                        Modelo

                    </p>

                     <Input
                       label="Modelo"
                       name="modelo"
                       value={orden.modelo || ""}
                       onChange={handleChange}
                     />

                </div>

            </div>

        </div>

    );

};

