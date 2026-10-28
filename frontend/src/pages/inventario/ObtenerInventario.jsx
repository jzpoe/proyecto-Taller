
import { useEffect, useState } from "react";
import { obtenerInventario } from "../../api/inventario";
import {
    Plus,
    Package,
    HardDrive,
    Layers,
    Minus,
    ChevronDown,
    ShoppingCart, X
} from "lucide-react";
import { Modal } from "../../components/ui/Modal";
import { InventarioPage } from "./Inventario";
import { obtenerClientes, registrarVenta, crearCliente } from "../../api/ventas.api";



export const ObtenerInventario = () => {
    const [productosInventario, setProductosInventario] = useState([]);
    const [modalAgregarInventario, setModalAgregarInventario] = useState(false);
    const [cantidadesSeleccionadas, setCantidadesSeleccionadas] = useState({});
    const [productosExpandidos, setProductosExpandidos] = useState({});
    const [clientes, setClientes] = useState([]);
    const [modalVenta, setModalVenta] = useState(false);
    const [clienteSeleccionado, setClienteSeleccionado] = useState("");
    const [guardandoVenta, setGuardandoVenta] = useState(false);
    const [mensajeVenta, setMensajeVenta] = useState("");
    const [mostrarFormularioCliente, setMostrarFormularioCliente] = useState(false);
    const [guardandoCliente, setGuardandoCliente] = useState(false);

    const [nuevoCliente, setNuevoCliente] = useState({
        nombre: "",
        telefono: "",
        correo: ""
    });

    const [mensajeCliente, setMensajeCliente] = useState("");

    const abrirModal = () => setModalAgregarInventario(true);
    const cerrarModal = () => setModalAgregarInventario(false);

    const alternarProducto = (id) => {
        setProductosExpandidos((actuales) => ({
            ...actuales,
            [id]: !actuales[id],
        }));
    };

    const abrirModalVenta = async () => {
        try {
            setMensajeVenta("");

            const response = await obtenerClientes();
            const lista = Array.isArray(response)
                ? response
                : response.clientes || [];

            setClientes(lista);
            setModalVenta(true);
        } catch (error) {
            console.error("Error al obtener clientes:", error);
            setMensajeVenta("No fue posible cargar los clientes.");
        }
    };

    const cerrarModalVenta = () => {
        setModalVenta(false);
        setClienteSeleccionado("");
        setMensajeVenta("");
    };

    const guardarNuevoCliente = async (e) => {
        e.preventDefault();

        if (!nuevoCliente.nombre.trim() || !nuevoCliente.telefono.trim()) {
            setMensajeCliente("El nombre y el teléfono son obligatorios.");
            return;
        }

        try {
            setGuardandoCliente(true);
            setMensajeCliente("");

            const response = await crearCliente({
                nombre: nuevoCliente.nombre.trim(),
                telefono: nuevoCliente.telefono.trim(),
                correo: nuevoCliente.correo.trim()
            });

            // El controlador devuelve el cliente dentro de crearCliente.
            const clienteCreado = response.crearCliente;

            // Actualizar la lista de clientes.
            const clientesActualizados = await obtenerClientes();

            setClientes(
                Array.isArray(clientesActualizados)
                    ? clientesActualizados
                    : clientesActualizados.clientes || []
            );

            // Seleccionar automáticamente al nuevo cliente.
            setClienteSeleccionado(clienteCreado._id);

            setNuevoCliente({
                nombre: "",
                telefono: "",
                correo: ""
            });

            setMostrarFormularioCliente(false);
            setMensajeCliente("");

        } catch (error) {
            console.error("Error al crear el cliente:", error);

            setMensajeCliente(
                error.response?.data?.message ||
                "No fue posible registrar el cliente."
            );
        } finally {
            setGuardandoCliente(false);
        }
    };

    const registrarVentaSeleccionada = async () => {
        if (!clienteSeleccionado) {
            setMensajeVenta("Selecciona un cliente.");
            return;
        }

        const productos = productosInventario.flatMap((producto) =>
            producto.variantes
                .filter((variante) => cantidadesSeleccionadas[variante._id] > 0)
                .map((variante) => ({
                    producto: producto._id,
                    varianteId: variante._id,
                    cantidad: cantidadesSeleccionadas[variante._id],
                }))
        );

        if (productos.length === 0) {
            setMensajeVenta("Selecciona al menos un producto.");
            return;
        }

        try {
            setGuardandoVenta(true);
            setMensajeVenta("");

            await registrarVenta({
                cliente: clienteSeleccionado,
                productos,
            });

            setCantidadesSeleccionadas({});
            await funcionObtenerProductos();

            cerrarModalVenta();
            alert("Venta registrada correctamente.");
        } catch (error) {
            console.error("Error al registrar venta:", error);

            setMensajeVenta(
                error.response?.data?.message ||
                "No fue posible registrar la venta."
            );

            // Refrescar el stock por si el servidor alcanzó a modificarlo.
            await funcionObtenerProductos();
        } finally {
            setGuardandoVenta(false);
        }
    };

    const funcionObtenerProductos = async () => {
        try {
            const response = await obtenerInventario();
            setProductosInventario(
                Array.isArray(response) ? response : []
            );
        } catch (error) {
            console.error(
                "Error al obtener el inventario:",
                error.response?.data || error.message
            );
        }
    };

    useEffect(() => {
        funcionObtenerProductos();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 p-5 sm:p-8">
            {/* Encabezado */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                        Gestión de productos
                    </p>

                    <h1 className="mt-1 text-3xl font-bold text-slate-800">
                        Inventario
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Consulta y administra los productos registrados.
                    </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">

                    <button
                        type="button"
                        onClick={abrirModal}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
                    >
                        <Plus size={19} />
                        Agregar inventario
                    </button>

                    <button
                        type="button"
                        onClick={abrirModalVenta}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                    >
                        <ShoppingCart size={19} />
                        Registrar venta
                    </button>
                </div>




            </div>

            {/* Resumen */}
            <div className="mb-6 flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
                    <Package size={23} />
                </div>

                <div>
                    <p className="text-sm text-slate-500">
                        Productos registrados
                    </p>

                    <p className="text-2xl font-bold text-slate-800">
                        {productosInventario.length}
                    </p>
                </div>
            </div>

            {/* Tarjetas desplegables */}
            {productosInventario.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
                    <Package
                        size={38}
                        className="mx-auto mb-3 text-slate-400"
                    />

                    <h2 className="font-semibold text-slate-700">
                        No hay productos registrados
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Agrega tu primer producto para comenzar.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {productosInventario.map((producto) => (
                        <div
                            key={producto._id}
                            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-blue-200 hover:shadow-md"
                        >
                            {/* Cabecera: siempre visible */}
                            <button
                                type="button"
                                onClick={() => alternarProducto(producto._id)}
                                aria-expanded={Boolean(
                                    productosExpandidos[producto._id]
                                )}
                                className="flex w-full items-center gap-4 p-5 text-left transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-300"
                            >
                                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                                    <HardDrive size={25} />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <h2 className="truncate text-lg font-bold text-slate-800">
                                        {producto.nombre}
                                    </h2>

                                    <span className="mt-2 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                                        {producto.categoria}
                                    </span>

                                    <p className="mt-2 text-xs text-slate-500">
                                        {producto.variantes.length} variantes
                                    </p>
                                </div>

                                <ChevronDown
                                    size={22}
                                    className={`shrink-0 text-slate-500 transition-transform duration-200 ${productosExpandidos[producto._id]
                                        ? "rotate-180"
                                        : ""
                                        }`}
                                />
                            </button>

                            {/* Detalles: solo visibles al desplegar */}
                            {productosExpandidos[producto._id] && (
                                <div className="border-t border-slate-100 p-5">
                                    <div className="mb-4 flex items-center gap-2">
                                        <Layers
                                            size={17}
                                            className="text-slate-400"
                                        />

                                        <h3 className="text-sm font-semibold text-slate-700">
                                            Variantes
                                        </h3>

                                        <span className="ml-auto rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                                            {producto.variantes.length}
                                        </span>
                                    </div>

                                    <div className="space-y-3">
                                        {producto.variantes.map(
                                            (variante, index) => {
                                                const cantidad =
                                                    cantidadesSeleccionadas[
                                                    variante._id
                                                    ] || 0;

                                                return (
                                                    <div
                                                        key={
                                                            variante._id || index
                                                        }
                                                        className="rounded-xl bg-slate-50 p-4"
                                                    >
                                                        <p className="mb-3 text-sm font-semibold text-slate-700">
                                                            Variante {index + 1}
                                                        </p>

                                                        <div className="mb-3 flex flex-wrap gap-2">
                                                            {Object.entries(
                                                                variante.atributos || {}
                                                            ).map(
                                                                ([nombre, valor]) => (
                                                                    <span
                                                                        key={nombre}
                                                                        className="rounded-md border border-blue-100 bg-white px-2.5 py-1 text-xs text-blue-700"
                                                                    >
                                                                        {nombre}:{" "}
                                                                        {valor}
                                                                    </span>
                                                                )
                                                            )}
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-3">
                                                            <div>
                                                                <p className="text-xs text-slate-500">
                                                                    Stock disponible
                                                                </p>

                                                                <p className="mt-1 font-semibold text-slate-800">
                                                                    {Number(
                                                                        variante.stock
                                                                    ) - cantidad}{" "}
                                                                    unidades
                                                                </p>
                                                            </div>

                                                            <div>
                                                                <p className="text-xs text-slate-500">
                                                                    Precio
                                                                </p>

                                                                <p className="mt-1 font-semibold text-emerald-700">
                                                                    {Number(
                                                                        variante.precio
                                                                    ).toLocaleString(
                                                                        "es-CO",
                                                                        {
                                                                            style: "currency",
                                                                            currency: "COP",
                                                                            maximumFractionDigits: 0,
                                                                        }
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Selección de cantidades */}
                                                        <div className="mt-4 flex items-center gap-3">
                                                            <button
                                                                type="button"
                                                                aria-label="Restar cantidad"
                                                                disabled={cantidad <= 0}
                                                                onClick={() =>
                                                                    setCantidadesSeleccionadas(
                                                                        (actuales) => ({
                                                                            ...actuales,
                                                                            [variante._id]:
                                                                                Math.max(
                                                                                    0,
                                                                                    (actuales[
                                                                                        variante._id
                                                                                    ] || 0) - 1
                                                                                ),
                                                                        })
                                                                    )
                                                                }
                                                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                                                            >
                                                                <Minus size={18} />
                                                            </button>

                                                            <span className="min-w-5 text-center font-semibold text-slate-800">
                                                                {cantidad}
                                                            </span>

                                                            <button
                                                                type="button"
                                                                aria-label="Sumar cantidad"
                                                                disabled={cantidad >= Number(variante.stock)}
                                                                onClick={() =>
                                                                    setCantidadesSeleccionadas(
                                                                        (actuales) => ({
                                                                            ...actuales,
                                                                            [variante._id]:
                                                                                Math.min(
                                                                                    Number(variante.stock),
                                                                                    (actuales[
                                                                                        variante._id
                                                                                    ] || 0) + 1
                                                                                ),
                                                                        })
                                                                    )
                                                                }
                                                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                                                            >
                                                                <Plus size={18} />
                                                            </button>
                                                        </div>

                                                        {/* Subtotal */}
                                                        <div className="mt-4 border-t border-slate-200 pt-3">
                                                            <span className="text-xs text-slate-500">
                                                                Subtotal
                                                            </span>

                                                            <p className="font-bold text-slate-800">
                                                                {new Intl.NumberFormat(
                                                                    "es-CO",
                                                                    {
                                                                        style: "currency",
                                                                        currency: "COP",
                                                                        maximumFractionDigits: 0,
                                                                    }
                                                                ).format(
                                                                    Number(
                                                                        variante.precio
                                                                    ) * cantidad
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Modal reutilizable */}
            <Modal
                isOpen={modalAgregarInventario}
                onClose={cerrarModal}
                title="Agregar producto al inventario"
                size="lg"
            >
                <div className="p-5 sm:p-7">
                    <InventarioPage
                        alGuardar={funcionObtenerProductos}
                    />
                </div>
            </Modal>

            <Modal
                isOpen={modalVenta}
                onClose={cerrarModalVenta}
                title="Registrar venta"
                size="lg"
            >
                <div className="space-y-5 p-5">
                    <div>
                        <label
                            htmlFor="clienteVenta"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Cliente
                        </label>

                        <select
                            id="clienteVenta"
                            value={clienteSeleccionado}
                            onChange={(e) => setClienteSeleccionado(e.target.value)}
                            className="w-full rounded-xl border border-slate-300 bg-white p-3"
                        >
                            <option value="">Selecciona un cliente</option>

                            {clientes.map((cliente) => (
                                <option key={cliente._id} value={cliente._id}>
                                    {cliente.nombre} — {cliente.telefono}
                                </option>
                            ))}
                        </select>

                        <button
                            type="button"
                            onClick={() => {
                                setMostrarFormularioCliente(!mostrarFormularioCliente);
                                setMensajeCliente("");
                            }}
                            className="mt-3 inline-flex items-center gap-2 rounded-lg border border-blue-200 px-3 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
                        >
                            <Plus size={16} />
                            {mostrarFormularioCliente ? "Cancelar creación" : "Crear cliente"}
                        </button>

                        {mostrarFormularioCliente && (
                            <form
                                onSubmit={guardarNuevoCliente}
                                className="mt-4 space-y-3 rounded-xl border border-slate-200 bg-white p-4"
                            >
                                <h3 className="font-semibold text-slate-800">
                                    Nuevo cliente
                                </h3>

                                <div>
                                    <label className="mb-1 block text-sm text-slate-600">
                                        Nombre completo *
                                    </label>

                                    <input
                                        type="text"
                                        value={nuevoCliente.nombre}
                                        onChange={(e) =>
                                            setNuevoCliente({
                                                ...nuevoCliente,
                                                nombre: e.target.value
                                            })
                                        }
                                        required
                                        className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500"
                                        placeholder="Nombre del cliente"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm text-slate-600">
                                        Teléfono *
                                    </label>

                                    <input
                                        type="tel"
                                        value={nuevoCliente.telefono}
                                        onChange={(e) =>
                                            setNuevoCliente({
                                                ...nuevoCliente,
                                                telefono: e.target.value
                                            })
                                        }
                                        required
                                        className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500"
                                        placeholder="Número de teléfono"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm text-slate-600">
                                        Correo electrónico (opcional)
                                    </label>

                                    <input
                                        type="email"
                                        value={nuevoCliente.correo}
                                        onChange={(e) =>
                                            setNuevoCliente({
                                                ...nuevoCliente,
                                                correo: e.target.value
                                            })
                                        }
                                        className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500"
                                        placeholder="correo@ejemplo.com"
                                    />
                                </div>

                                {mensajeCliente && (
                                    <p role="alert" className="text-sm text-red-600">
                                        {mensajeCliente}
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    disabled={guardandoCliente}
                                    className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {guardandoCliente ? "Guardando cliente..." : "Guardar cliente"}
                                </button>
                            </form>
                        )}

                        {clientes.length === 0 && (
                            <p className="mt-2 text-sm text-amber-700">
                                No hay clientes registrados. Debes crear uno antes de vender.
                            </p>
                        )}
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4">
                        <h3 className="mb-3 font-semibold text-slate-800">
                            Resumen de productos
                        </h3>

                        {productosInventario.flatMap((producto) =>
                            producto.variantes
                                .filter(
                                    (variante) =>
                                        cantidadesSeleccionadas[variante._id] > 0
                                )
                                .map((variante) => (
                                    <div
                                        key={variante._id}
                                        className="flex justify-between gap-4 border-b border-slate-200 py-2 text-sm"
                                    >
                                        <span>
                                            {producto.nombre} (
                                            {Object.values(variante.atributos || {}).join(", ")}
                                            ) × {cantidadesSeleccionadas[variante._id]}
                                        </span>

                                        <span className="font-semibold">
                                            {(
                                                variante.precio *
                                                cantidadesSeleccionadas[variante._id]
                                            ).toLocaleString("es-CO", {
                                                style: "currency",
                                                currency: "COP",
                                                maximumFractionDigits: 0,
                                            })}
                                        </span>
                                    </div>
                                ))
                        )}

                        <div className="mt-4 flex justify-between font-bold text-slate-800">
                            <span>Total</span>

                            <span>
                                {productosInventario
                                    .reduce(
                                        (total, producto) =>
                                            total +
                                            producto.variantes.reduce(
                                                (subtotal, variante) =>
                                                    subtotal +
                                                    Number(variante.precio) *
                                                    (cantidadesSeleccionadas[variante._id] || 0),
                                                0
                                            ),
                                        0
                                    )
                                    .toLocaleString("es-CO", {
                                        style: "currency",
                                        currency: "COP",
                                        maximumFractionDigits: 0,
                                    })}
                            </span>
                        </div>
                    </div>

                    {mensajeVenta && (
                        <p role="alert" className="text-sm text-red-600">
                            {mensajeVenta}
                        </p>
                    )}

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={cerrarModalVenta}
                            disabled={guardandoVenta}
                            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
                        >
                            Cancelar
                        </button>

                        <button
                            type="button"
                            onClick={registrarVentaSeleccionada}
                            disabled={guardandoVenta || clientes.length === 0}
                            className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                        >
                            {guardandoVenta ? "Registrando..." : "Confirmar venta"}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

