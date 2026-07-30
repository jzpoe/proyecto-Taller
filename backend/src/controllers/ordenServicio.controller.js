
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
        
        console.log(req.files);

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
        console.log(req.files);
   
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

export { crearOrdenServicio, obtenerOrdenes };