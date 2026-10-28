
import { useEffect, useState } from "react";
import { obtenerInventario } from "../../api/inventario";
import {
    Plus,
    Package,
    HardDrive,
    Layers,
    Minus,
    ChevronDown,
} from "lucide-react";
import { Modal } from "../../components/ui/Modal";
import { InventarioPage } from "./Inventario";

export const ObtenerInventario = () => {
    const [productosInventario, setProductosInventario] = useState([]);
    const [modalAgregarInventario, setModalAgregarInventario] = useState(false);
    const [cantidadesSeleccionadas, setCantidadesSeleccionadas] = useState({});
    const [productosExpandidos, setProductosExpandidos] = useState({});

    const abrirModal = () => setModalAgregarInventario(true);
    const cerrarModal = () => setModalAgregarInventario(false);

    const alternarProducto = (id) => {
        setProductosExpandidos((actuales) => ({
            ...actuales,
            [id]: !actuales[id],
        }));
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

                <button
                    type="button"
                    onClick={abrirModal}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
                >
                    <Plus size={19} />
                    Agregar inventario
                </button>
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
                                    className={`shrink-0 text-slate-500 transition-transform duration-200 ${
                                        productosExpandidos[producto._id]
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
        </div>
    );
};

