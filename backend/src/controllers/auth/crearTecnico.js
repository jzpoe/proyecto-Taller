import Usuario from "../../models/usuario.model.js";
import bcrypt from "bcrypt";

export const crearTecnico = async (req, res) => {

    try {

        const { nombre, usuario, contrasena } = req.body;

        // Validar datos obligatorios
        if (!nombre || !usuario || !contrasena) {

            return res.status(400).json({
                ok: false,
                message: "Nombre, usuario y contraseña son obligatorios."
            });

        }

        // Verificar si el usuario ya existe
        const usuarioExistente = await Usuario.findOne({
            usuario: usuario.toLowerCase()
        });

        if (usuarioExistente) {

            return res.status(400).json({
                ok: false,
                message: "El nombre de usuario ya está registrado."
            });

        }

        // Encriptar contraseña
        const contrasenaEncriptada = await bcrypt.hash(
            contrasena,
            10
        );

        // Crear técnico
        const nuevoTecnico = await Usuario.create({

            nombre,

            usuario: usuario.toLowerCase(),

            contrasena: contrasenaEncriptada,

            rol: "Tecnico",

            activo: true

        });

        return res.status(201).json({

            ok: true,

            message: "Técnico creado correctamente.",

            tecnico: {

                id: nuevoTecnico._id,

                nombre: nuevoTecnico.nombre,

                usuario: nuevoTecnico.usuario,

                rol: nuevoTecnico.rol,

                activo: nuevoTecnico.activo

            }

        });

    } catch (error) {

        console.error("Error al crear técnico:", error);

        return res.status(500).json({

            ok: false,

            message: "Error del servidor."

        });

    }

};