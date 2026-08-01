import express from 'express';
import { actualizarEquipo, createEquipo, eliminarEquipo, encontrarEquipoID, getEquipos } from '../controllers/equipo.controller.js';
import asignacionEquipo from '../controllers/asignacionEquipo.js';
import { crearCliente, obtenerClientes } from '../controllers/crearCliente.js';
import { uploadImagenes } from '../controllers/middleware/upload.js';
import { actualizarOrdenServicio, crearOrdenServicio, obtenerOrdenes } from '../controllers/ordenServicio.controller.js';
import { buscarClientePorTelefono } from '../controllers/buscarClientePorTelefono.js';
import { obtenerOrdenPorId } from '../controllers/obtenerOrdenPorId.js';

const router = express.Router();


router.get('/equipos', getEquipos)
router.post('/equipos', uploadImagenes.array("imagen", 10), createEquipo)
router.get('/equipo/:id', encontrarEquipoID)
router.put('/equipo/:id', actualizarEquipo)
router.delete('/equipo/:id', eliminarEquipo)
//URL para asignar equipos
router.post('/equipo/:id/asignar', asignacionEquipo)

//URL para CREAR CLIENTES
router.post('/cliente', crearCliente)
router.get('/clientes', obtenerClientes)

//orden de servicio
router.post("/orden", crearOrdenServicio);

router.get("/telefono/:telefono", buscarClientePorTelefono)
router.post(
    "/ordenServicio",
    uploadImagenes.array("imagenes", 10),
    crearOrdenServicio
);
router.get("/ordenServicio", obtenerOrdenes)
router.get("/ordenServicio/:id", obtenerOrdenPorId )
router.put("/ordenServicio/:id",actualizarOrdenServicio);


export default router;

