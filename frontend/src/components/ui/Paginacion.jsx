export const Paginacion = ({
    paginaActual,
    totalPaginas,
    cambiarPagina,
    totalRegistros,
    registrosPorPagina,

}) => {

    const inicio = (paginaActual - 1) * registrosPorPagina + 1;

    const fin = Math.min(
        paginaActual * registrosPorPagina,
        totalRegistros
    );
    return (

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 border-t">

            <p className="text-sm text-gray-600">

                Mostrando

                <strong> {inicio} </strong>

                -

                <strong> {fin} </strong>

                de

                <strong> {totalRegistros} </strong>

                registros

            </p>

            <div className="flex gap-2">

                <button
                    onClick={() => cambiarPagina(paginaActual - 1)}
                    disabled={paginaActual === 1}
                    className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    Anterior
                </button>

                {
                    [...Array(totalPaginas)].map((_, index) => (

                        <button
                            key={index}
                            onClick={() => cambiarPagina(index + 1)}
                            className={`px-4 py-2 rounded transition ${paginaActual === index + 1
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 hover:bg-gray-300"
                                }`}
                        >
                            {index + 1}
                        </button>

                    ))
                }

                <button
                    onClick={() => cambiarPagina(paginaActual + 1)}
                    disabled={paginaActual === totalPaginas}
                    className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    Siguiente
                </button>

            </div>

        </div>
    );
};