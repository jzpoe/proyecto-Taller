import { useState } from "react";
import { editarTenicos } from "../../api/usuarios.api";
import { useEffect } from "react";
import toast from "react-hot-toast";




export const EditarTecnico = ({ tecnico, onTecnicoEditado }) => {
    const [formulario, setFormulario] = useState({
        nombre: "",
        usuario: "",
        contrasena: ""
    });

    useEffect(() => {
        if (!tecnico) return;

        setFormulario({
            nombre: tecnico.nombre || "",
            usuario: tecnico.usuario || "",
            contrasena: ""
        })
    }, [tecnico])

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormulario((prev) => ({
            ...prev,

            [name]: value
        }));

    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await editarTenicos(tecnico._id, formulario)
            toast.success(
                response.message || "Técnico editado correctamente."
            );
            onTecnicoEditado();

        } catch (error) {
            console.error("Error al cargar técnicos:", error);

            toast.error(
                error.response?.data?.message ||
                "No se pudieron editar los técnicos."
            );
        }
    }


    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-5 inset-0 z-50 flex items-center justify-center  bg-white backdrop-blur-sm p-4"
        >

            <div className="w-full max-w-md bg-white/50 rounded-2xl shadow-2xl overflow-hidden p-4">




                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre
                </label>

                <input
                    type="text"
                    name="nombre"
                    value={formulario.nombre}
                    onChange={handleChange}
                    placeholder="Nombre completo"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />





                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Usuario
                </label>

                <input
                    type="text"
                    name="usuario"
                    value={formulario.usuario}
                    onChange={handleChange}
                    placeholder="Ej: santiago-tec"
                    autoComplete="off"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />





                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña
                </label>

                <input
                    type="password"
                    name="contrasena"
                    onChange={handleChange}
                    placeholder="Contraseña"
                    autoComplete="new-password"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />





                <div className="flex justify-end pt-2">

                    <button
                        type="submit"

                        className="
                            px-5 py-2.5
                            rounded-lg
                            bg-blue-700
                            text-white
                            text-sm font-semibold
                            hover:bg-blue-800
                            transition
                            shadow-sm
                        "
                    >

                        {/* {cargando
                            ? "Creando..."
                            : "Crear Técnico"
                        } */}
                        Actualizar
                    </button>

                </div>
            </div>
        </form>
    )
}