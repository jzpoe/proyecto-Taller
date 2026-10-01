import { useEffect, useState } from "react";
import { Pencil, Trash2, UserPlus, Users } from "lucide-react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

import { editarTenicos, eliminarTecnicos, obtenerTecnicos } from "../../api/usuarios.api";
import { Modal } from "../../components/ui/Modal";
import { FormularioTecnico } from "./FormularioTecnico";
import { EditarTecnico } from "./EditarTecnico";

export const TecnicosPage = () => {

    const [tecnicos, setTecnicos] = useState([]);
    const [modalAbierto, setModalAbierto] = useState(false);
     const [tecnicoSeleccionado, setTecnicoSeleccionado] = useState(null);
    const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
   



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

        const resultado = await Swal.fire({
            title: "¿Eliminar técnico?",
            text: "Esta acción eliminará al técnico del sistema.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
            reverseButtons: true,
        });

        if (!resultado.isConfirmed) {
            return;
        }

        try {
            const response = await eliminarTecnicos(id);

            await Swal.fire({
                title: "¡Eliminado!",
                text: response.message || "Técnico eliminado correctamente.",
                icon: "success",
                confirmButtonColor: "#1e40af",
            });

            cargarTecnicos();

        } catch (error) {
            console.error("Error al eliminar técnico:", error);

            Swal.fire({
                title: "Error",
                text:
                    error.response?.data?.message ||
                    "No se pudo eliminar el técnico.",
                icon: "error",
                confirmButtonColor: "#1e40af",
            });
        }
    };


    


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

    const tecnicoEditado = async () => {
    await cargarTecnicos();
    cerrarModalEditar();
};

    const abrirModalEditar = (tecnico) => {
        setTecnicoSeleccionado(tecnico);
        setModalEditarAbierto(true);
    };

    const cerrarModalEditar = () => {
        setModalEditarAbierto(false);
        setTecnicoSeleccionado(null);
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
                                        <div>

                                            <td className="px-4 py-3">
                                                <button
                                                    onClick={() => abrirModalEditar(tecnico)}
                                                    className="
                                                    p-2
                                                    rounded-lg
                                                    text-blue-600
                                                    hover:bg-red-50
                                                    hover:blue-red-700
                                                    transition
                                                "
                                                    title="Eliminar técnico"
                                                >
                                                    <Pencil size={18} />
                                                </button>
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
                                        </div>

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

            <Modal
                size="md"
                isOpen={modalEditarAbierto}
                onClose={cerrarModalEditar}
                title="Editar Técnico"
            >
                {tecnicoSeleccionado && (
                    <EditarTecnico
                        tecnico={tecnicoSeleccionado}
                        onTecnicoEditado={tecnicoEditado}
                    />
                )}
            </Modal>

        </div>

    );

};