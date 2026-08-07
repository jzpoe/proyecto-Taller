import { useState } from "react";
import { Input } from "../../components/ui/Input";
import { inicioSesion } from "../../api/auth.api";
import { useNavigate } from "react-router-dom";
import { MonitorSmartphone, LogIn } from "lucide-react";

import logo from "../../assets/logo.png";
import toast from "react-hot-toast";


export const LoginPage = () => {
    const [login, setLogin] = useState({
        usuario: "",
        contrasena: ""
    });
    const navigate = useNavigate();




    const handleChange = (e) => {


        const { name, value } = e.target

        setLogin((prev) => ({ ...prev, [name]: value }))

    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await inicioSesion(login)

            localStorage.setItem(
                "token",
                response.token
            );

            localStorage.setItem(
                "usuario",
                JSON.stringify(response.usuario)
            );

            toast.success('Bienvenido');
            navigate("/");

        } catch (error) {
            toast.error(error.response.data.message);

        }
    }


    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-8">

            <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">

                {/* Panel izquierdo */}

                <div className="bg-gradient-to-br from-blue-900 to-blue-700 text-white flex flex-col items-center justify-center p-12">

                    <img

                        src={logo}

                        className="w-44 mb-8"

                    />

                    

                    <p className="mt-6 text-center text-blue-100 leading-7">

                        Sistema profesional para la gestión de

                        reparaciones, inventario y soporte técnico.

                    </p>

                    <div className="mt-10">

                        <MonitorSmartphone size={90} />

                    </div>

                </div>

                {/* Panel derecho */}

                <div className="flex items-center justify-center p-10">

                    <form

                        onSubmit={handleSubmit}

                        className="w-full max-w-md"

                    >

                        <h2 className="text-3xl font-bold text-gray-800">

                            Bienvenido

                        </h2>

                        <p className="text-gray-500 mt-2 mb-8">

                            Inicia sesión para continuar.

                        </p>

                        <Input

                            label="Usuario"

                            name="usuario"

                            value={login.usuario}

                            onChange={handleChange}

                        />

                        <div className="mt-5">

                            <Input

                                label="Contraseña"

                                name="contrasena"

                                type="password"

                                value={login.contrasena}

                                onChange={handleChange}

                            />

                        </div>

                        <button

                            type="submit"

                            className="mt-8 w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-xl font-semibold flex justify-center items-center gap-3 transition-all duration-300 hover:scale-105 shadow-lg"

                        >

                            <LogIn size={20} />

                            Iniciar Sesión

                        </button>

                        <p className="text-center text-gray-400 mt-8 text-sm">

                            © 2026 4Tech

                        </p>

                    </form>

                </div>

            </div>

        </div>
    )
}