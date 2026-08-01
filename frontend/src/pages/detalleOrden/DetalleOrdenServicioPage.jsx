import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { actualizarOrdenServicio, obtenerOrdenPorId } from "../../api/ordenServicio.api";
import { EstadoCard } from "../../components/detalleOrden/EstadoCard";
import { ClienteCard } from "../../components/detalleOrden/ClienteCard";
import { EquipoDetalles } from "../../components/detalleOrden/EquipoDetalles";
import { ProblemaDetalles } from "../../components/detalleOrden/ProblemaDetalles";
import { FotografiaDetalles } from "../../components/detalleOrden/FotografiaDetalles";
import { ProcesoReparacionCard } from "../../components/detalleOrden/ProcesoReparacionCard";
import toast from "react-hot-toast";
import { generarOrdenPDF } from "../../utils/generarOrdenPDF";
import { generarOrdenServicioPDF } from "../../utils/generarOrdenServicioPDF";


export const DetalleOrdenServicioPage = () => {

    const { id } = useParams();

    const [orden, setOrden] = useState(null);

    const handleGuardar = async () => {

        try {

            const response = await actualizarOrdenServicio(
                orden._id,
                orden
            );

            setOrden(response.orden);

            toast.success(response.mensaje);

        } catch (error) {

            console.error(error);

            toast.error(
                error.response?.data?.mensaje ||
                "Error al actualizar la orden."
            );

        }

    };

    const cargarOrden = async () => {

        try {

            const orden = await obtenerOrdenPorId(id);

            setOrden(orden.ordenServicio);
            console.log(orden.ordenServicio)

        } catch (error) {

            console.error(error);

        }

    }

    useEffect(() => {

        cargarOrden();

    }, []);

    if (!orden) {

        return <h2>Cargando...</h2>;

    }

    const handleChange = (e) => {

        const { name, value } = e.target;

        setOrden((prev) => ({

            ...prev,

            [name]: value

        }));

    };

    return (

        <div className="bg-gray-100 min-h-screen p-6 space-y-6">

            <EstadoCard orden={orden} />
            <div className="flex justify-end gap-4">

                <button
                    onClick={handleGuardar}
                    className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded-lg shadow"
                >
                    💾 Guardar Cambios
                </button>

                <button
                    onClick={() => generarOrdenServicioPDF(orden)}
                    className="bg-green-700 hover:bg-green-800 text-white px-5 py-2 rounded-lg shadow"
                >
                    🖨️ Imprimir PDF
                </button>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                <ClienteCard cliente={orden.cliente} />
                <EquipoDetalles orden={orden} />


            </div>

            <ProblemaDetalles orden={orden} />
            <FotografiaDetalles orden={orden} />
            <ProcesoReparacionCard
                orden={orden}
                onGuardar={handleGuardar}
                handleChange={handleChange}
            />

        </div>

    );

};