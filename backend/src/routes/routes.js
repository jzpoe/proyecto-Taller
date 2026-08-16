import express from 'express';
import { actualizarEquipo, createEquipo, eliminarEquipo, encontrarEquipoID, getEquipos } from '../controllers/equipo.controller.js';
import asignacionEquipo from '../controllers/asignacionEquipo.js';
import { crearCliente, obtenerClientes } from '../controllers/crearCliente.js';
import { uploadImagenes } from '../controllers/middleware/upload.js';
import { actualizarOrdenServicio, crearOrdenServicio, eliminarequipoorden, obtenerOrdenes } from '../controllers/ordenServicio.controller.js';
import { buscarClientePorTelefono } from '../controllers/buscarClientePorTelefono.js';
import { obtenerOrdenPorId } from '../controllers/obtenerOrdenPorId.js';
import { register } from '../controllers/auth/register.js';
import { login } from '../controllers/auth/login.js';
import { actualizarCliente } from '../controllers/actualizarCliente.js';
import { verificarToken } from '../controllers/middleware/authMiddleware.js';

const router = express.Router();


router.get('/equipos', verificarToken, getEquipos)
router.post('/equipos', uploadImagenes.array("imagen", 10), createEquipo)
router.get('/equipo/:id', encontrarEquipoID)
router.put('/equipo/:id', actualizarEquipo)
router.delete('/equipo/:id', eliminarEquipo)
//URL para asignar equipos
router.post('/equipo/:id/asignar', asignacionEquipo)

//URL para CREAR CLIENTES
router.post('/cliente',verificarToken, crearCliente)
router.get('/clientes', obtenerClientes)

//orden de servicio
router.post("/orden", verificarToken, crearOrdenServicio);

router.get("/telefono/:telefono", buscarClientePorTelefono)
router.post(
    "/ordenServicio",
    uploadImagenes.array("imagenes", 10),
    crearOrdenServicio
);
router.get("/ordenServicio", verificarToken, obtenerOrdenes)
router.get("/ordenServicio/:id",verificarToken,  obtenerOrdenPorId )
router.put("/ordenServicio/:id",verificarToken, actualizarOrdenServicio);
router.put("/cliente/:id",actualizarCliente);
router.put("/equipo/:id", actualizarEquipo)
router.delete("/ordenServicio/:id",eliminarequipoorden)

router.post("/registrar", register);
router.post("/login", login)


export default router;

