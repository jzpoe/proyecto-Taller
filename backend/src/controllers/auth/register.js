import Usuario from "../../models/usuario.model.js";
import bcrypt from "bcrypt";

const register = async (req, res) => {

    try {

        const datosUsuario = req.body;

        const validarUsuario = await Usuario.findOne({
            usuario: datosUsuario.usuario
        });

        if (validarUsuario) {

            return res.status(409).json({
                ok: false,
                message: "El usuario ya existe."
            });

        }

        const encryptPassword = await bcrypt.hash(
            datosUsuario.contrasena,
            10
        );

        const nuevoUsuario = {

            nombre: datosUsuario.nombre,

            usuario: datosUsuario.usuario,

            contrasena: encryptPassword,

            rol: datosUsuario.rol,

        };

        const usuarioCreado = await Usuario.create(
            nuevoUsuario
        );

        const respuesta = {

            _id: usuarioCreado._id,

            nombre: usuarioCreado.nombre,

            usuario: usuarioCreado.usuario,

            rol: usuarioCreado.rol,

            activo: usuarioCreado.activo

        };

        return res.status(201).json({

            ok: true,

            message: "Usuario registrado correctamente.",

            respuesta

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            ok: false,

            message: "Error al registrar el usuario."

        });

    }

};

export { register };