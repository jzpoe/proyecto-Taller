import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { obtenerOrdenPorId } from "../api/ordenServicio.api";
import { EstadoCard } from "../components/detalleOrden/EstadoCard";

export const DetalleOrdenServicioPage = () => {

    const { id } = useParams();

    const [orden, setOrden] = useState(null);

    const cargarOrden = async () => {

    try {

        const orden = await obtenerOrdenPorId(id);

        console.log("ORDEN RECIBIDA:");
        console.log(orden.ordenServicio);

        setOrden(orden.ordenServicio);

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

    return (

        <div>

            <EstadoCard orden={orden} />

        </div>

    );

};