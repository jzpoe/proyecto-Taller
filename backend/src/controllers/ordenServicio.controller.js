
import mongoose from "mongoose";
import Cliente from "../models/cliente.model.js";
import OrdenServicio from "../models/ordenServicio.model.js";
import { obtenerSiguienteNumero } from "../services/counter.service.js";

const crearOrdenServicio = async (req, res) => {
    try {

        const {
            nombre,
            telefono,
            correo,
            problemaReportado,
            tipoEquipo,
            marca,
            modelo,
            serial,
            accesorios,
            observacionesRecepcion,
            passwordEquipo,
            imagenes
        } = req.body;


        const crearOrdenServicio = async (req, res) => {
            try {

                const {
                    nombre,
                    telefono,
                    correo,
                    problemaReportado,
                    tipoEquipo,
                    marca,
                    modelo,
                    serial,
                    accesorios,
                    observacionesRecepcion,
                    passwordEquipo,
                    imagenes
                } = req.body;

                // ===============================
                // Validar campos obligatorios
                // ===============================

                if (!nombre || !telefono || !problemaReportado) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: "Nombre, teléfono y problema reportado son obligatorios."
                    });
                }

                // ===============================
                // Buscar cliente
                // ===============================

                let cliente = await Cliente.findOne({ telefono });

                // ===============================
                // Si no existe, lo creamos
                // ===============================

                if (!cliente) {

                    cliente = await Cliente.create({
                        nombre,
                        telefono,
                        correo
                    });

                } else {

                    // Actualizar datos si cambiaron

                    let actualizar = false;

                    if (cliente.nombre !== nombre) {
                        cliente.nombre = nombre;
                        actualizar = true;
                    }

                    if (correo && cliente.correo !== correo) {
                        cliente.correo = correo;
                        actualizar = true;
                    }

                    if (actualizar) {
                        await cliente.save();
                    }

                }

                // ===============================
                // Generar consecutivo
                // ===============================

                const consecutivo = await obtenerSiguienteNumero("ordenServicio");

                const numeroOrden = `OS-${String(consecutivo).padStart(6, "0")}`;

                // ===============================
                // Crear orden
                // ===============================

                const nuevaOrden = await OrdenServicio.create({

                    numeroOrden,

                    cliente: cliente._id,

                    problemaReportado,

                    tipoEquipo,

                    marca,

                    modelo,

                    serial,

                    accesorios,

                    observacionesRecepcion,

                    passwordEquipo,
                    imagenes

                });

                // ===============================
                // Consultar con populate
                // ===============================

                const ordenCompleta = await OrdenServicio.findById(nuevaOrden._id)
                    .populate("cliente");

                return res.status(201).json({

                    ok: true,

                    mensaje: "Orden creada correctamente.",

                    orden: ordenCompleta

                });

            } catch (error) {

                console.error(error);

                return res.status(500).json({

                    ok: false,

                    mensaje: "Error al crear la orden."

                });

            }
        };

        // ===============================
        // Validar campos obligatorios
        // ===============================

        if (!nombre || !telefono || !problemaReportado) {
            return res.status(400).json({
                ok: false,
                mensaje: "Nombre, teléfono y problema reportado son obligatorios."
            });
        }

        // ===============================
        // Buscar cliente
        // ===============================

        let cliente = await Cliente.findOne({ telefono });

        // ===============================
        // Si no existe, lo creamos
        // ===============================

        if (!cliente) {

            cliente = await Cliente.create({
                nombre,
                telefono,
                correo
            });

        } else {

            // Actualizar datos si cambiaron

            let actualizar = false;

            if (cliente.nombre !== nombre) {
                cliente.nombre = nombre;
                actualizar = true;
            }

            if (correo && cliente.correo !== correo) {
                cliente.correo = correo;
                actualizar = true;
            }

            if (actualizar) {
                await cliente.save();
            }

        }

        // ===============================
        // Generar consecutivo
        // ===============================

        const consecutivo = await obtenerSiguienteNumero("ordenServicio");

        const numeroOrden = `OS-${String(consecutivo).padStart(6, "0")}`;

        // ===============================
        // Crear orden
        // ===============================

        const nuevaOrden = await OrdenServicio.create({

            numeroOrden,

            cliente: cliente._id,

            problemaReportado,

            tipoEquipo,

            marca,

            modelo,

            serial,

            accesorios,

            observacionesRecepcion,

            passwordEquipo,

            imagenes

        });

        // ===============================
        // Consultar con populate
        // ===============================

        const ordenCompleta = await OrdenServicio.findById(nuevaOrden._id)
            .populate("cliente");

        return res.status(201).json({

            ok: true,

            mensaje: "Orden creada correctamente.",

            orden: ordenCompleta

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            ok: false,

            mensaje: "Error al crear la orden."

        });

    }
};

const obtenerOrdenes = async (req, res) => {

    try {

        const ordenes = await OrdenServicio.find()
            .populate("cliente")
            .populate("tecnicoAsignado", "nombre usuario rol")
            .sort({ createdAt: -1 });

        return res.status(200).json(ordenes);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            ok: false,
            mensaje: "Error al obtener las órdenes."
        });

    }

};



const actualizarOrdenServicio = async (req, res) => {

    try {

        const { id } = req.params;

        const orden = await OrdenServicio.findById(id);

        if (!orden) {

            return res.status(404).json({
                ok: false,
                mensaje: "Orden no encontrada."
            });

        }

        // Si es Técnico, solamente puede modificar
        // una orden que esté asignada a él.

        if (req.usuario.rol === "Tecnico") {

            if (
                !orden.tecnicoAsignado ||
                orden.tecnicoAsignado.toString() !== req.usuario.id
            ) {

                return res.status(403).json({
                    ok: false,
                    mensaje: "No tienes permiso para modificar esta orden."
                });

            }

        }

        // Datos que sí se pueden actualizar
        const datosActualizacion = {
            ...req.body
        };

        // Las fechas las controla exclusivamente el backend
        delete datosActualizacion.fechaDiagnostico;
        delete datosActualizacion.fechaEntrega;


        // Fecha en que comienza el diagnóstico
        if (
            datosActualizacion.estado === "En diagnóstico" &&
            !orden.fechaDiagnostico
        ) {

            datosActualizacion.fechaDiagnostico = new Date();

        }


        // Fecha en que se entrega la orden
        if (
            datosActualizacion.estado === "Entregado" &&
            !orden.fechaEntrega
        ) {

            datosActualizacion.fechaEntrega = new Date();

        }


        const ordenActualizada =
            await OrdenServicio.findByIdAndUpdate(
                id,
                datosActualizacion,
                {
                    new: true
                }
            )
            .populate("cliente")
            .populate(
                "tecnicoAsignado",
                "nombre usuario rol"
            );


        return res.json({

            ok: true,

            mensaje: "Orden actualizada correctamente.",

            orden: ordenActualizada

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            ok: false,

            mensaje: "Error al actualizar la orden."

        });

    }

};

const eliminarequipoorden = async (req, res) => {
    try {
        const id_eliminar = req.params.id

        if (!mongoose.isValidObjectId(id_eliminar)) {
            return res.status(400).json({
                message: "ID inválido"
            });
        }

        const objeroEliminado = await OrdenServicio.findByIdAndDelete(
            id_eliminar
        );

        return res.status(200).json({ message: "Equipo eliminado con extito" })
    } catch (err) {
        console.error("Error al eliminar el equipo:", err);
        return res.status(500).json({ message: "Error al eliminar" });
    }
}

export const editarOrdenes = async (req, res) => {
    try {
        const idParaActualizar = req.params.id
        const bodyParaActualizar = req.body

        //VALIDAR SI EL ID TIENE FORMATO VALIDO

        if (!mongoose.isValidObjectId(idParaActualizar)) {
            return res.status(400).json({
                message: "ID inválido"
            });
        }

        //no permitir modificar el serial
        // if (req.body.serial) {
        //     return res.status(400).json({
        //         message: "El serial no puede ser modificado"
        //     })
        // }
        //actualizar documento 

        const datosActualizacion = {
            ...req.body
        };

        // Las fechas las controla el backend
        delete datosActualizacion.fechaDiagnostico;
        delete datosActualizacion.fechaEntrega;


        // Si pasa a "En diagnóstico"
        // y todavía no tiene fecha de diagnóstico
        if (
            datosActualizacion.estado === "En diagnóstico" &&
            !orden.fechaDiagnostico
        ) {
            datosActualizacion.fechaDiagnostico = new Date();
        }


        // Si pasa a "Entregado"
        // y todavía no tiene fecha de entrega
        if (
            datosActualizacion.estado === "Entregado" &&
            !orden.fechaEntrega
        ) {
            datosActualizacion.fechaEntrega = new Date();
        }

        const equipoActualizado = await Equipo.findByIdAndUpdate(
            idParaActualizar,
            bodyParaActualizar,
            { new: true }
        );

        if (!equipoActualizado) {

            return res.status(404).json
                ({ message: "equipo ingresado no se encuentra en la base de datos" })
        } else {
            return res.status(200).json(equipoActualizado)
        }
    } catch (err) {
        console.error("Error al actualizar el equipo:", err);
        return res.status(500).json({ message: "Error al encontrar" });
    }
}


export { crearOrdenServicio, obtenerOrdenes, actualizarOrdenServicio, eliminarequipoorden };