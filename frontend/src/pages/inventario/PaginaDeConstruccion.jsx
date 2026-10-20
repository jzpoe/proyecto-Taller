import { useState } from "react"
import { Modal } from "../../components/ui/Modal"


export const PaginaDeConstruccion = () => {


    const [productosInventario, setProductosInventario] = useState([]);
    const [formulario, setFormulario] = useState({
        nombre: "",
        categoria: "",
        variantes: []
    });

    const handleSubmit = () => {

    }



    return newFunction(handleSubmit);
}


function newFunction(handleSubmit) {
    return (
        <form
            onSubmit={handleSubmit}
            className="min-h-screen bg-gray-50 p-6 md:p-10"
        >
            {/* Encabezado */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-800 md:text-3xl">
                        Inventario
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        Administra y organiza el inventario de tus productos.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => {}}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition duration-200 hover:bg-indigo-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    <span className="text-lg">+</span>
                    Agregar inventario
                </button>
            </div>

            {/* Contenido principal */}
            <div className="flex min-h-[350px] items-center justify-center rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                <div className="max-w-md text-center">

                    {/* Icono */}
                    <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="h-10 w-10"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M20.25 7.5l-8.25-4.5-8.25 4.5m16.5 0l-8.25 4.5m8.25-4.5v9l-8.25 4.5m0-9L3.75 7.5m8.25 4.5v9m-8.25-13.5v9l8.25 4.5"
                            />
                        </svg>
                    </div>

                    {/* Mensaje */}
                    <h2 className="text-xl font-bold text-gray-800">
                        ¡Estamos preparando algo nuevo!
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-gray-500">
                        Próximamente podrás registrar, organizar y gestionar
                        el inventario de tus productos desde esta sección.
                    </p>

                    {/* Etiqueta de estado */}
                    <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-700">
                        <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                        Funcionalidad en desarrollo
                    </div>
                </div>
            </div>

            {/* Modal */}
            <Modal />
        </form>
    );
}


