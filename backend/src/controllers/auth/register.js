import Usuario from "../../models/usuario.model.js"
import bcrypt from "bcrypt"

const register = async (req, res) => {
    try {
        const datosUsuario = req.body
        
        const validarCorreo = await Usuario.findOne({ correo: datosUsuario.correo });

        if (validarCorreo) {
            return res.status(409).json({
                ok: false,
                message: "el cliente ya se encuentra regustrado"
            })
        } else {

            const encryptPassword = await bcrypt.hash(datosUsuario.contrasena, 10)
            const nuevoUsuario = {
                nombre: datosUsuario.nombre,
                correo: datosUsuario.correo,
                contrasena: encryptPassword
            };
           
            const usuarioCreado = await Usuario.create(nuevoUsuario);
             const respuesta = {
                _id: usuarioCreado._id,
                nombre: usuarioCreado.nombre,
                correo: usuarioCreado.correo,
                rol: usuarioCreado.rol,
                activo: usuarioCreado.activo
            };
            return res.status(201).json({
                ok: true,
                message: "Usuario registrado correctamente.",
                respuesta
            })
        }

    } catch (error) {
        console.error("Error al crear el cliente:", error);
        return res.status(500).json({ message: "Error al crear el CLIENTE" });
    }
}

export { register };