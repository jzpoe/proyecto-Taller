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
import { verificarAdministrador, verificarToken } from '../controllers/middleware/authMiddleware.js';
import { obtenerTecnicos } from '../controllers/auth/usuarios.controller.js';
import { asignarTecnico } from '../controllers/asignarTenico.js';
import { obtenerMisOrdenes } from '../controllers/obtenerOrdenes.js';
import { crearTecnico } from '../controllers/auth/crearTecnico.js';

const router = express.Router();


router.get("/ordenServicio/mis-ordenes", verificarToken,obtenerMisOrdenes);


router.get('/equipos', verificarToken, getEquipos)
router.post('/equipos', uploadImagenes.array("imagen", 10), createEquipo)
router.get('/equipo/:id', encontrarEquipoID)
router.put('/equipo/:id', actualizarEquipo)
router.delete('/equipo/:id', eliminarEquipo)
//URL para asignar equipos
router.post('/equipo/:id/asignar', asignacionEquipo)

//URL para CREAR CLIENTES
router.post('/cliente', verificarToken, crearCliente)
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
router.get("/ordenServicio/:id", verificarToken, obtenerOrdenPorId)
router.put("/cliente/:id", actualizarCliente);
router.put("/equipo/:id", actualizarEquipo)
router.delete("/ordenServicio/:id", verificarToken,verificarAdministrador, eliminarequipoorden)


router.post("/registrar", register);
router.post("/login", login)

router.get("/usuarios/tecnicos", verificarToken, verificarAdministrador, obtenerTecnicos)
router.post( "/usuarios/tecnicos", verificarToken, verificarAdministrador, crearTecnico);

router.put("/ordenServicio/:id/asignar-tecnico", verificarToken, asignarTecnico);

router.put("/ordenServicio/:id", verificarToken, actualizarOrdenServicio);


export default router;

