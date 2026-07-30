import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";

export const MainLayout = () => {
    const [menuAbierto, setMenuAbierto] = useState(false);

    const linkClass = ({ isActive }) =>
        `block px-3 py-2 rounded transition ${isActive
            ? "bg-white text-blue-800 font-semibold"
            : "hover:bg-blue-700"
        }`;

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
                        Gestión de Activos
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

                        </nav>

                    )
                }

            </aside>

            {/* Contenido */}

            <main className="flex-1 p-6 overflow-x-hidden">

                <Outlet />

            </main>

        </div>

    );

};