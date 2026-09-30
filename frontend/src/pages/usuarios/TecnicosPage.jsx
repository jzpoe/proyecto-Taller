import { useEffect, useState } from "react";
import { Trash2, UserPlus, Users } from "lucide-react";
import toast from "react-hot-toast";

import { eliminarTecnicos, obtenerTecnicos } from "../../api/usuarios.api";
import { Modal } from "../../components/ui/Modal";
import { FormularioTecnico } from "./FormularioTecnico";

export const TecnicosPage = () => {

    const [tecnicos, setTecnicos] = useState([]);
    const [modalAbierto, setModalAbierto] = useState(false);

    console.log(tecnicos)

    const cargarTecnicos = async () => {

        try {

            const response = await obtenerTecnicos();

            setTecnicos(response.tecnicos || []);

        } catch (error) {

            console.error("Error al cargar técnicos:", error);

            toast.error(
                error.response?.data?.message ||
                "No se pudieron cargar los técnicos."
            );

        }

    };


    const eliminarTecnico = async (id) => {
        try {
            const response = await eliminarTecnicos(id)

            toast.success(
                response.message || "Técnico eliminado correctamente."
            );

            cargarTecnicos()

        } catch (error) {
            console.error("Error al cargar técnicos:", error);

            toast.error(
                error.response?.data?.message ||
                "No se pudieron cargar los técnicos."
            );
        }
    }


    useEffect(() => {

        cargarTecnicos();

    }, []);

    const abrirModal = () => {
        setModalAbierto(true);
    };

    const cerrarModal = () => {
        setModalAbierto(false);
    };

    const tecnicoCreado = async () => {

        await cargarTecnicos();

        cerrarModal();

    };

    return (

        <div className="space-y-6">

            {/* Encabezado */}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                <div>

                    <h1 className="text-2xl font-bold text-gray-800">
                        Técnicos
                    </h1>

                    <p className="text-gray-500">
                        Administración de técnicos del taller
                    </p>

                </div>

                <button
                    onClick={abrirModal}
                    className="flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg shadow transition"
                >

                    <UserPlus size={18} />

                    Nuevo Técnico

                </button>

            </div>


            {/* Tabla */}

            <div className="bg-white rounded-xl shadow overflow-hidden">

                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead className="bg-gray-100">

                            <tr>

                                <th className="px-4 py-3 text-left">
                                    Nombre
                                </th>

                                <th className="px-4 py-3 text-left">
                                    Usuario
                                </th>

                                <th className="px-4 py-3 text-left">
                                    Rol
                                </th>

                                <th className="px-4 py-3 text-left">
                                    Acción
                                </th>

                                <th className="px-4 py-3 text-left">
                                    Estado
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {tecnicos.length > 0 ? (

                                tecnicos.map((tecnico) => (

                                    <tr
                                        key={tecnico._id || tecnico.id}
                                        className="border-t hover:bg-gray-50"
                                    >

                                        <td className="px-4 py-3 font-medium">
                                            {tecnico.nombre}
                                        </td>

                                        <td className="px-4 py-3">
                                            {tecnico.usuario}
                                        </td>

                                        <td className="px-4 py-3">
                                            {tecnico.rol}
                                        </td>

                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => eliminarTecnico(tecnico._id)}
                                                className="
            p-2
            rounded-lg
            text-red-600
            hover:bg-red-50
            hover:text-red-700
            transition
        "
                                                title="Eliminar técnico"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>

                                        <td className="px-4 py-3">

                                            <span
                                                className={
                                                    tecnico.activo
                                                        ? "px-3 py-1 rounded-full text-sm bg-green-100 text-green-700"
                                                        : "px-3 py-1 rounded-full text-sm bg-red-100 text-red-700"
                                                }
                                            >

                                                {tecnico.activo
                                                    ? "Activo"
                                                    : "Inactivo"
                                                }

                                            </span>

                                        </td>

                                    </tr>

                                ))

                            ) : (

                                <tr>

                                    <td
                                        colSpan={4}
                                        className="px-4 py-12 text-center text-gray-500"
                                    >

                                        <Users
                                            size={45}
                                            className="mx-auto mb-3 text-gray-400"
                                        />

                                        No hay técnicos registrados.

                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

            </div>


            {/* Modal */}

            <Modal
                size="md"
                isOpen={modalAbierto}
                onClose={cerrarModal}
                title="Nuevo Técnico"
            >

                <FormularioTecnico
                    onTecnicoCreado={tecnicoCreado}
                />

            </Modal>

        </div>

    );

};