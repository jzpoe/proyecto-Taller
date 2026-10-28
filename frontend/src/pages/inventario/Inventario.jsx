import { useEffect } from "react";
import { useState } from "react";
import { datosInventarioBackend } from "../../api/inventario";
import { ObtenerInventario } from "./ObtenerInventario";
import { catalogoProductos } from "../../data/catalogoProductos";





export const InventarioPage = ({ alGuardar }) => {
    const [datosInventario, setDatosInvetario] = useState({
        nombre: "",
        categoria: "",
        variantes: []
    });
    const [confirmacion, setConfirmacion] = useState(null);
    const [mensaje, setMensaje] = useState("");




    const seleccionarProducto = (e) => {
        const nombreSeleccionado = e.target.value;

        const producto = catalogoProductos.find(
            (item) => item.nombre === nombreSeleccionado
        );

        setDatosInvetario((prev) => ({
            ...prev,
            nombre: nombreSeleccionado,
            categoria: producto?.categoria || ""
        }));
    };


    const handleChange = (e, index, tipo) => {
        const { name, value } = e.target;

        // Actualizar nombre y categoria
        if (index === undefined) {
            setDatosInvetario((prev) => ({
                ...prev,
                [name]: value
            }));

            return;
        }

        if (tipo === "atributos") {
            setDatosInvetario((prev) => ({
                ...prev,
                variantes: prev.variantes.map((variante, i) =>
                    i === index
                        ? {
                            ...variante,
                            atributos: {
                                ...variante.atributos,
                                [name]: value
                            }
                        }
                        : variante
                )
            }));

            return;
        }

        // Actualizar stock o precio de una variante
        setDatosInvetario((prev) => ({
            ...prev,
            variantes: prev.variantes.map((variante, i) =>
                i === index
                    ? { ...variante, [name]: value }
                    : variante
            )
        }));
    };

    const agregarVariantes = () => {
        const atributosIniciales = {
            capacidad: ""
        };

        if (datosInventario.nombre === "Memoria RAM") {
            atributosIniciales.tipo = "";
        }

        setDatosInvetario((prev) => ({
            ...prev,
            variantes: [
                ...prev.variantes,
                {
                    atributos: atributosIniciales,
                    stock: "",
                    costo: "",
                    precio: ""
                }
            ]
        }));
    };



    const handleSubmit = async (e) => {
        e.preventDefault();

        setMensaje("");

        try {
            const datosEnviar = {
                ...datosInventario,
                variantes: datosInventario.variantes.map((variante) => ({
                    ...variante,
                    atributos: Object.fromEntries(
                        Object.entries(variante.atributos).map(
                            ([clave, valor]) => [clave, valor.trim()]
                        )
                    ),
                    stock: Number(variante.stock),
                    costo: Number(variante.costo),
                    precio: Number(variante.precio)
                }))
            };

            const respuesta = await datosInventarioBackend(datosEnviar);

            setMensaje(respuesta.message || "Producto procesado correctamente.");
            setConfirmacion(null);

            setDatosInvetario({
                nombre: "",
                categoria: "",
                variantes: []
            });

            if (alGuardar) {
                await alGuardar();
                if (alGuardar) {
                    await alGuardar();
                }
            }

        } catch (error) {
            const errorBackend = error.response?.data;

            if (errorBackend?.requiereConfirmacion) {
                setConfirmacion({
                    ...errorBackend,
                    datos: {
                        ...datosInventario,
                        variantes: datosInventario.variantes.map((variante) => ({
                            ...variante,
                            atributos: { ...variante.atributos },
                            stock: Number(variante.stock),
                            costo: Number(variante.costo),
                            precio: Number(variante.precio)
                        }))
                    }
                });

                setMensaje("El producto ya existe y requiere confirmar los cambios.");
                return;
            }

            setMensaje(
                errorBackend?.message ||
                error.message ||
                "No fue posible guardar el producto."
            );

            console.error("Error al guardar el producto:", errorBackend || error);
        }
    };

    const confirmarCambios = async () => {
        if (!confirmacion) return;

        try {
            const respuesta = await datosInventarioBackend({
                ...confirmacion.datos,
                confirmarCambios: true
            });

            setMensaje(respuesta.message || "Cambios confirmados correctamente.");
            setConfirmacion(null);

            setDatosInvetario({
                nombre: "",
                categoria: "",
                variantes: []
            });

        } catch (error) {
            setMensaje(
                error.response?.data?.message ||
                "No fue posible confirmar los cambios."
            );

            console.error(
                "Error al confirmar cambios:",
                error.response?.data || error.message
            );
        }
    };

    useEffect(() => {
        console.log(datosInventario);
    }, [datosInventario]);


    return (
        <div className="min-h-screen bg-slate-100 px-4 py-4 sm:px-6">
            <div className="mx-auto max-w-3xl">
                {/* Encabezado */}
                <div className="mb-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                        Gestión de inventario
                    </p>

                    <h1 className="mt-1 text-2xl font-bold text-slate-800">
                        Registrar producto
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Ingresa la información del producto y sus variantes.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {mensaje && (
                        <div
                            role="status"
                            className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800"
                        >
                            {mensaje}
                        </div>
                    )}

                    {confirmacion && (
                        <section className="space-y-3 rounded-xl border border-amber-300 bg-amber-50 p-4">
                            <h2 className="font-semibold text-amber-900">
                                Confirmar cambios de precios y costos
                            </h2>

                            <p className="text-sm text-amber-800">
                                El producto ya existe. Revisa los cambios antes de aplicarlos.
                            </p>

                            {confirmacion.cambios?.map((cambio, index) => (
                                <div
                                    key={`${cambio.varianteId}-${index}`}
                                    className="rounded-lg border border-amber-200 bg-white p-3 text-sm"
                                >
                                    <p className="mb-2 font-medium text-slate-800">
                                        Variante: {cambio.atributos
                                            ? Object.values(cambio.atributos).join(" / ")
                                            : cambio.varianteId}
                                    </p>

                                    <p>
                                        Costo: ${Number(cambio.costoActual).toLocaleString("es-CO")}
                                        {" → "}
                                        ${Number(cambio.costoNuevo).toLocaleString("es-CO")}
                                    </p>

                                    <p>
                                        Precio: ${Number(cambio.precioActual).toLocaleString("es-CO")}
                                        {" → "}
                                        ${Number(cambio.precioNuevo).toLocaleString("es-CO")}
                                    </p>
                                </div>
                            ))}

                            <div className="flex flex-wrap gap-3">
                                <button
                                    type="button"
                                    onClick={confirmarCambios}
                                    className="rounded-lg bg-amber-600 px-4 py-2 font-semibold text-white hover:bg-amber-700"
                                >
                                    Confirmar cambios
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setConfirmacion(null);
                                        setMensaje("Operación cancelada.");
                                    }}
                                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 hover:bg-slate-100"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </section>
                    )}

                    {/* Información general */}
                    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                        <div className="mb-6 border-b border-slate-100 pb-4">
                            <h2 className="text-lg font-semibold text-slate-800">
                                Información general
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Datos principales del producto.
                            </p>
                        </div>



                        {/* Nombre */}
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                            {/* Nombre del producto */}
                            <div>
                                <label
                                    htmlFor="nombre"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    Nombre del producto
                                </label>

                                <select
                                    id="nombre"
                                    name="nombre"
                                    value={datosInventario.nombre}
                                    onChange={seleccionarProducto}
                                    required
                                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800"
                                >
                                    <option value="">Selecciona un producto</option>

                                    {catalogoProductos.map((producto) => (
                                        <option key={producto.nombre} value={producto.nombre}>
                                            {producto.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Categoría automática */}
                            <div>
                                <label
                                    htmlFor="categoria"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    Categoría asignada
                                </label>

                                <input
                                    id="categoria"
                                    type="text"
                                    value={datosInventario.categoria}
                                    placeholder="Selecciona primero un producto"
                                    readOnly
                                    className="w-full rounded-xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm text-slate-800"
                                />
                            </div>

                        </div>


                    </section>

                    {/* Variantes */}
                    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">

                        <div className="mb-6 flex flex-col justify-between gap-4 border-b border-slate-100 pb-4 sm:flex-row sm:items-center">
                            <div>
                                <h2 className="text-lg font-semibold text-slate-800">
                                    Variantes del producto
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Define la capacidad, el stock y el precio de cada variante.
                                </p>
                            </div>

                            <span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                                {datosInventario.variantes.length} variantes
                            </span>
                        </div>

                        {/* Lista dinámica */}
                        <div className="space-y-5">

                            {datosInventario.variantes.map((variante, index) => (
                                <div
                                    key={index}
                                    className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                                >
                                    <div className="mb-5 flex items-center gap-3">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-sm font-bold text-blue-700">
                                            {index + 1}
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-slate-800">
                                                Variante {index + 1}
                                            </h3>

                                            <p className="text-xs text-slate-500">
                                                Características y existencias
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                                        {/* Capacidad */}
                                        <div>
                                            <label
                                                htmlFor={`capacidad-${index}`}
                                                className="mb-2 block text-sm font-medium text-slate-700"
                                            >
                                                Capacidad
                                            </label>

                                            <input
                                                id={`capacidad-${index}`}
                                                type="text"
                                                name="capacidad"
                                                value={variante.atributos.capacidad}
                                                onChange={(e) =>
                                                    handleChange(e, index, "atributos")
                                                }
                                                placeholder="Ej. 480 GB"
                                                required
                                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />


                                        </div>

                                        {datosInventario.nombre === "Memoria RAM" && (
                                            <div>
                                                <label
                                                    htmlFor={`tipo-${index}`}
                                                    className="mb-2 block text-sm font-medium text-slate-700"
                                                >
                                                    Generación DDR
                                                </label>

                                                <select
                                                    id={`tipo-${index}`}
                                                    name="tipo"
                                                    value={variante.atributos.tipo || ""}
                                                    onChange={(e) =>
                                                        handleChange(e, index, "atributos")
                                                    }
                                                    required
                                                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800"
                                                >
                                                    <option value="">Selecciona una generación</option>
                                                    <option value="DDR2">DDR2</option>
                                                    <option value="DDR3">DDR3</option>
                                                    <option value="DDR4">DDR4</option>
                                                    <option value="DDR5">DDR5</option>
                                                </select>
                                            </div>
                                        )}

                                        {/* Stock */}
                                        <div>
                                            <label
                                                htmlFor={`stock-${index}`}
                                                className="mb-2 block text-sm font-medium text-slate-700"
                                            >
                                                Stock disponible
                                            </label>

                                            <input
                                                id={`stock-${index}`}
                                                type="number"
                                                name="stock"
                                                min="0"
                                                step="1"
                                                value={variante.stock}
                                                onChange={(e) =>
                                                    handleChange(e, index)
                                                }
                                                placeholder="Ej. 10"
                                                required
                                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                                        </div>

                                        {/* Costo de compra */}
                                        <div>
                                            <label
                                                htmlFor={`costo-${index}`}
                                                className="mb-2 block text-sm font-medium text-slate-700"
                                            >
                                                Costo de compra (COP)
                                            </label>

                                            <input
                                                id={`costo-${index}`}
                                                type="number"
                                                name="costo"
                                                min="0"
                                                step="any"
                                                value={variante.costo}
                                                onChange={(e) => handleChange(e, index)}
                                                placeholder="Ej. 120000"
                                                required
                                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                            />
                                        </div>

                                        {/* Precio */}
                                        <div>
                                            <label
                                                htmlFor={`precio-${index}`}
                                                className="mb-2 block text-sm font-medium text-slate-700"
                                            >
                                                Precio (COP)
                                            </label>

                                            <input
                                                id={`precio-${index}`}
                                                type="number"
                                                name="precio"
                                                min="0"
                                                step="any"
                                                value={variante.precio}
                                                onChange={(e) =>
                                                    handleChange(e, index)
                                                }
                                                placeholder="Ej. 180000"
                                                required
                                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                                        </div>

                                    </div>
                                </div>
                            ))}

                        </div>

                        {/* Botón agregar variante */}
                        <button
                            type="button"
                            onClick={agregarVariantes}
                            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700"
                        >
                            <span className="text-lg">+</span>
                            Agregar otra variante
                        </button>

                    </section>

                    {/* Acciones */}
                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <button
                            type="submit"
                            disabled={datosInventario.variantes.length === 0}
                            className="rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Guardar producto
                        </button>
                    </div>

                </form>

            </div>

        </div>
    );
}
