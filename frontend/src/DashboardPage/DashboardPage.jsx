import { useEffect, useState } from "react";
import { editarEquipoBackend, eliminarEquipoBackend, obtenerEquipos } from "../api/equipo.api";
import { CardDashboard } from "./CardDashboard";
import { Modal } from "../components/ui/Modal";
import { FormularioCliente } from "../components/formularios/FormularioCliente";
import { CardDasboardClientes } from "./CardDasboardClientes";
import { AsignarEquipoPage } from "../pages/AsignarEquipoPage";
import { UserPlus, LaptopMinimal } from "lucide-react";
import { FormularioEquipos } from "../pages/equipo/FormularioEquiops";
import { UltimasOrdenes } from "./UltimasOrdenes";
import { BadgeEstado } from "../components/ui/BadgeEstado";
import { InputEditarEquipo } from "./InputEditarEquipo";
import toast, { Toaster } from 'react-hot-toast';
import Swal from "sweetalert2";
import { FormularioOrdenServicio } from "../pages/FormularioOrdenServicio";
import { crearOrdenServicio, eliminarEquipoOrdenServicio, obtenerOrdenes } from "../api/ordenServicio.api";
import { obtenerClientes } from "../api/cliente.api";



export const DashboardPage = () => {
    const [equipos, setEquipos] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [modalAbierto, setModalAbierto] = useState(null)
    const [editandoEquipo, setEditandoEquipo] = useState(null)
    const [ordenes, setOrdenes] = useState([]);




    const cargarEquipos = async () => {
        try {

            const response = await obtenerEquipos()
            setEquipos(response.data)

        } catch (error) {
            console.error("error al cargar los equipos")

        }

    }

    const cargarClientes = async () => {

        try {
            const response = await obtenerClientes()
            setClientes(response.data)
        } catch (error) {
            console.error("error al consultar clientes", error)
        }


    }




    const totalEquipos = equipos.length
    const totalEquipos1 = equipos.slice(0, 5)

    const disponibles = equipos.filter((equipo) => {
        return equipo.estado === "Disponible"
    }).length

    const reparacion1 = equipos.filter((reparacion) => {
        return reparacion.estado === "En Reparacion" || reparacion.estado === "REPARACION"
    }).length

    const asignacion = equipos.filter((asignado) => {
        return asignado.estado === "Asignado"
    }).length

    const clientesActivos = clientes.filter((disponible) => {
        return disponible.estado === "activo"
    }).length
    const clientesInactivos = clientes.filter((inactivo) => {
        return inactivo.estado === "inactivo"
    }).length
    const cantidadClientes = clientes.length

    const abrirModal = (modal) => {
        setModalAbierto(modal)
    }

    const cerrarModal = () => {
        setModalAbierto(false)

    }

    const editarEquipo = async (equipo) => {
        setEditandoEquipo(equipo)

        abrirModal("editar")

    }




    const handleEliminar = async (equipos_id) => {


        try {

            const resultado = await Swal.fire({
                icon: "warning",

                title: "¿Está seguro?",

                text: "Esta acción no se puede deshacer.",

                showCancelButton: true,

                confirmButtonText: "Sí, eliminar",

                cancelButtonText: "Cancelar"
            })
            if (resultado.isConfirmed) {
                
                await eliminarEquipoOrdenServicio(equipos_id)
                cargarOrdenes()
                toast.success('El equipo se ha eliminado correctamente.');

            }

        } catch (error) {
            console.error("error al elimianr el equipo seleccionado", error)
        }

    }

    const cargarOrdenes = async () => {

        const response = await obtenerOrdenes();

        setOrdenes(response.data);
        console.log("aqui llegan las oedenes: ", ordenes)

    };

    useEffect(() => {
        cargarEquipos()
        cargarClientes()
        cargarOrdenes()
        obtenerOrdenes()

    }, [])



    return (

        <>

            <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
                <CardDashboard
                    titulo="Total de Equipos"
                    valor={totalEquipos}


                />
                <CardDashboard
                    titulo="Equipos Disponibles"
                    valor={disponibles}

                />
                <CardDashboard
                    titulo="Equipos asignados"
                    valor={asignacion}

                />

                <CardDashboard
                    titulo="Equipos en Reparación"
                    valor={reparacion1}

                />
                <CardDasboardClientes
                    titulo="Clientes disponibles"
                    valor={clientesActivos}
                />
                <CardDasboardClientes
                    titulo="Clientes Activos"
                    valor={clientesActivos}
                />
                <CardDasboardClientes
                    titulo="Clientes Inactivos"
                    valor={clientesInactivos}
                />





            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-6 mb-6">
                {/* <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-200 hover:scale-105"

                    onClick={() => abrirModal("cliente")}>

                    <UserPlus size={18} />
                    Crear Cliente
                </button> */}

                {/* <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-200 hover:scale-105"

                    onClick={() => abrirModal("asignar")}>
                    <LaptopMinimal size={18} />
                    Asignar cliente
                </button> */}

                <button className="flex items-center gap-2 bg-amber-500 hover:bg-amber-800 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-200 hover:scale-105"

                    onClick={() => abrirModal("equipo")}>
                    <LaptopMinimal size={18} />
                    Crear Equipo
                </button>
                <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-200 hover:scale-105"

                    onClick={() => abrirModal("orden")}>
                    <LaptopMinimal size={18} />
                    Crear Orden de servicio
                </button>
            </div>


            {/* <Modal
                size="md"
                isOpen={modalAbierto === "cliente"}
                onClose={cerrarModal}
                title="Crear Cliente"

            ><FormularioCliente
                    onCrearCliente={cargarClientes}
                />
            </Modal> */}

            <Modal
                size="xl"
                isOpen={modalAbierto === "orden"}
                onClose={cerrarModal}
                title="Nueva Orden de Servicio"
            >
                <FormularioOrdenServicio
                    onCrearOrden={cargarOrdenes}
                />
            </Modal>




            {/* <Modal
                size="xl"
                isOpen={modalAbierto === "asignar"}
                onClose={cerrarModal}
                title="Asignar cliente"

            ><AsignarEquipoPage />
            </Modal> */}

            <Modal
                size="lg"
                isOpen={modalAbierto === "equipo"}
                onClose={cerrarModal}
                title="Crear Equipos"


            > <FormularioEquipos
                    onEquipoCreado={cargarEquipos}

                />
            </Modal>

            <UltimasOrdenes
                onEquipoCreado={cargarEquipos}
                ultimosEquipos={equipos}
                onEditar={editarEquipo}
                onEliminar={handleEliminar}
                ordenes={ordenes}

            />


            <Modal
                isOpen={modalAbierto === "editar"}
                onClose={cerrarModal}
                title="Editar Equipos"


            > <InputEditarEquipo
                    equipoEditar={editandoEquipo}
                    onEquipoActualizado={cargarEquipos}
                    cerrarModal={cerrarModal}

                />
            </Modal>


            <BadgeEstado
                estado={equipos.estado}
            />



        </>
    )

}