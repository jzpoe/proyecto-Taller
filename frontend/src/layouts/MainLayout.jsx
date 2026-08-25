import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Menu, X, } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LogOut, UserCircle2 } from "lucide-react";
import logo from "../assets/logo.png";
import { useAuth } from "../hooks/useAuth";



export const MainLayout = () => {
    const [menuAbierto, setMenuAbierto] = useState(false);
    const navigate = useNavigate();
    const { usuario, logout } = useAuth();
    const { login: cerrarSesionContext } = useAuth();

    const linkClass = ({ isActive }) =>
        `block px-3 py-2 rounded transition ${isActive
            ? "bg-white text-blue-800 font-semibold"
            : "hover:bg-blue-700"
        }`;



    const cerrarSesion = () => {

        logout();

        navigate("/login");

    };



    return (

        <div className="min-h-screen bg-gray-100 md:flex">

            <aside className="bg-blue-800 text-white md:w-64">

                {/* Barra superior para móvil */}
                <div className="flex items-center justify-between p-4 md:hidden">

                    <h1 className="text-xl font-bold">
                        Gestión de Activos
                    </h1>

                    <button
                        onClick={() => setMenuAbierto(!menuAbierto)}
                    >
                        {
                            menuAbierto
                                ? <X size={28} />
                                : <Menu size={28} />
                        }
                    </button>

                </div>

                {/* Menú escritorio */}
                <div className="hidden md:block p-6">

                    <h1 className="text-3xl font-bold mb-8">
                        Sistema de Gestión
                    </h1>

                    <nav className="flex flex-col gap-2">

                        <NavLink to="/" end className={linkClass}>
                            Dashboard
                        </NavLink>

                        <NavLink to="/equipos" className={linkClass}>
                            Equipos
                        </NavLink>

                        <NavLink to="/ordenes" className={linkClass}>
                            Órdenes de Servicio
                        </NavLink>

                        {usuario?.rol === "Administrador" && (
                            <NavLink to="/tecnicos" className={linkClass}>
                                Técnicos
                            </NavLink>
                        )}

                    </nav>

                </div>

                {/* Menú móvil */}

                {
                    menuAbierto && (

                        <nav className="flex flex-col gap-2 p-4 md:hidden">

                            <NavLink
                                to="/"
                                end
                                className={linkClass}
                                onClick={() => setMenuAbierto(false)}
                            >
                                Dashboard
                            </NavLink>



                            <NavLink
                                to="/equipos"
                                className={linkClass}
                                onClick={() => setMenuAbierto(false)}
                            >
                                Equipos
                            </NavLink>

                            <NavLink
                                to="/ordenes"
                                className={linkClass}
                                onClick={() => setMenuAbierto(false)}
                            >
                                Órdenes de Servicio
                            </NavLink>

                            {usuario?.rol === "Administrador" && (
                                <NavLink
                                    to="/tecnicos"
                                    className={linkClass}
                                    onClick={() => setMenuAbierto(false)}
                                >
                                    Técnicos
                                </NavLink>
                            )}

                        </nav>

                    )
                }

            </aside>

            {/* Contenido */}

            <main className="flex-1 overflow-x-hidden">

                <header className=" bg-white border-b shadow-sm px-10 py-5 flex justify-between items-center sticky top-0 z-20 ">
                    <div className="flex items-center h-full">

                        <img
                            src={logo}
                            alt="RodanTech"
                            className="w-40 object-contain"
                        />

                    </div>

                    <div className="flex items-center gap-4 bg-gray-50 rounded-xl px-4 py-2 border border-gray-200">
                        <div className="flex items-center gap-3">

                            <UserCircle2
                                size={44}
                                className="text-blue-700"
                            />

                            <div>

                                <p className="font-semibold text-gray-800">
                                    {usuario?.nombre}
                                </p>

                                <p className="text-xs uppercase tracking-wide text-blue-600 font-semibold">
                                    {usuario?.rol}
                                </p>

                            </div>

                        </div>

                        <button

                            onClick={cerrarSesion}

                            className="
                                flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-3
                                rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                        >

                            <LogOut size={18} />

                            Salir

                        </button>

                    </div>

                </header>

                <div className="p-6">

                    <Outlet />

                </div>

            </main>

        </div>

    );

};