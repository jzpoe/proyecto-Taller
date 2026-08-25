import { useState } from "react";
import toast from "react-hot-toast";
import { crearTecnico } from "../../api/usuarios.api";

export const FormularioTecnico = ({ onTecnicoCreado }) => {

    const [formulario, setFormulario] = useState({
        nombre: "",
        usuario: "",
        contrasena: ""
    });

    const [cargando, setCargando] = useState(false);

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormulario((prev) => ({
            ...prev,
            [name]: value
        }));

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (
            !formulario.nombre.trim() ||
            !formulario.usuario.trim() ||
            !formulario.contrasena.trim()
        ) {

            toast.error("Todos los campos son obligatorios.");

            return;
        }

        try {

            setCargando(true);

            const response = await crearTecnico(formulario);

            toast.success(
                response.message || "Técnico creado correctamente."
            );

            setFormulario({
                nombre: "",
                usuario: "",
                contrasena: ""
            });

            if (onTecnicoCreado) {
                onTecnicoCreado();
            }

        } catch (error) {

            console.error("Error al crear técnico:", error);

            toast.error(
                error.response?.data?.message ||
                "No se pudo crear el técnico."
            );

        } finally {

            setCargando(false);

        }

    };

    return (

        <form
            onSubmit={handleSubmit}
            className="space-y-5"
        >

            <div>

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

            </div>

            <div>

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

            </div>

            <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña
                </label>

                <input
                    type="password"
                    name="contrasena"
                    value={formulario.contrasena}
                    onChange={handleChange}
                    placeholder="Contraseña"
                    autoComplete="new-password"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

            </div>

            <div className="flex justify-end pt-2">

                <button
                    type="submit"
                    disabled={cargando}
                    className="bg-blue-700 hover:bg-blue-800 disabled:bg-gray-400 text-white px-5 py-2 rounded-lg shadow transition"
                >

                    {cargando
                        ? "Creando..."
                        : "Crear Técnico"
                    }

                </button>

            </div>

        </form>

    );

};