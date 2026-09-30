
import { useState } from "react";
import toast from "react-hot-toast";
import { Eye, EyeOff, X, LockKeyhole } from "lucide-react";
import { cambiarContrasenaApi } from "../../api/cambiar_contrasena.api";

function ModalCambiarContrasena({ cerrarModal }) {

    const [datos, setDatos] = useState({
        contrasenaActual: "",
        nuevaContrasena: "",
        confirmarContrasena: ""
    });

    const [mostrarContrasena, setMostrarContrasena] = useState({
        contrasenaActual: false,
        nuevaContrasena: false,
        confirmarContrasena: false
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setDatos((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const alternarVisibilidad = (campo) => {
        setMostrarContrasena((prev) => ({
            ...prev,
            [campo]: !prev[campo]
        }));
    };

    async function guardarContrasena(e) {
        e.preventDefault();

        if (
            !datos.contrasenaActual ||
            !datos.nuevaContrasena ||
            !datos.confirmarContrasena
        ) {
            toast.error("Por favor, completa todos los campos.");
            return;
        }

        if (datos.nuevaContrasena !== datos.confirmarContrasena) {
            toast.error("Las contraseñas no coinciden.");
            return;
        }

        const token = localStorage.getItem("token");

        try {
            await cambiarContrasenaApi(datos, token);

            toast.success("La contraseña fue cambiada con éxito.");

            setDatos({
                contrasenaActual: "",
                nuevaContrasena: "",
                confirmarContrasena: ""
            });

            cerrarModal();

        } catch (error) {
            console.error("Error al cambiar la contraseña", error);

            toast.error(
                error.response?.data?.message ||
                "No se pudo cambiar la contraseña"
            );
        }
    }

    const campos = [
        {
            name: "contrasenaActual",
            label: "Contraseña actual",
            placeholder: "Escribe tu contraseña actual"
        },
        {
            name: "nuevaContrasena",
            label: "Nueva contraseña",
            placeholder: "Escribe tu nueva contraseña"
        },
        {
            name: "confirmarContrasena",
            label: "Confirmar contraseña",
            placeholder: "Confirma tu nueva contraseña"
        }
    ];

    return (
        <form
            onSubmit={guardarContrasena}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        >

            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">

                {/* Encabezado */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 bg-gray-50">

                    <div className="flex items-center gap-3">

                        <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
                            <LockKeyhole size={22} />
                        </div>

                        <div>
                            <h2 className="text-lg font-bold text-gray-800">
                                Cambiar contraseña
                            </h2>

                            <p className="text-xs text-gray-500">
                                Actualiza la contraseña de tu cuenta
                            </p>
                        </div>

                    </div>

                    <button
                        type="button"
                        onClick={cerrarModal}
                        className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition"
                    >
                        <X size={20} />
                    </button>

                </div>

                {/* Formulario */}
                <div className="p-6 space-y-5">

                    {campos.map((campo) => (
                        <div key={campo.name}>

                            <label
                                htmlFor={campo.name}
                                className="block mb-2 text-sm font-semibold text-gray-700"
                            >
                                {campo.label}
                            </label>

                            <div className="relative">

                                <input
                                    id={campo.name}
                                    type={
                                        mostrarContrasena[campo.name]
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder={campo.placeholder}
                                    name={campo.name}
                                    value={datos[campo.name]}
                                    onChange={handleChange}
                                    className="
                                        w-full
                                        border border-gray-300
                                        rounded-lg
                                        px-3 py-2.5 pr-11
                                        text-sm
                                        outline-none
                                        transition
                                        focus:border-blue-500
                                        focus:ring-2
                                        focus:ring-blue-100
                                    "
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        alternarVisibilidad(campo.name)
                                    }
                                    className="
                                        absolute
                                        right-3
                                        top-1/2
                                        -translate-y-1/2
                                        text-gray-400
                                        hover:text-blue-600
                                        transition
                                    "
                                    title={
                                        mostrarContrasena[campo.name]
                                            ? "Ocultar contraseña"
                                            : "Mostrar contraseña"
                                    }
                                >
                                    {mostrarContrasena[campo.name]
                                        ? <EyeOff size={19} />
                                        : <Eye size={19} />
                                    }
                                </button>

                            </div>

                        </div>
                    ))}

                </div>

                {/* Botones */}
                <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200">

                    <button
                        type="button"
                        onClick={cerrarModal}
                        className="
                            px-4 py-2.5
                            rounded-lg
                            border border-gray-300
                            text-gray-700
                            text-sm font-medium
                            hover:bg-gray-100
                            transition
                        "
                    >
                        Cancelar
                    </button>

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
                        Cambiar contraseña
                    </button>

                </div>

            </div>

        </form>
    );
}

export default ModalCambiarContrasena;

