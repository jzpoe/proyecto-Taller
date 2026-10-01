import Usuario from "../../models/usuario.model.js";
import bcrypt from "bcrypt"



export const cambiarContrasena = async (req, res) => {
    try {
        const { contrasenaActual, nuevaContrasena, confirmarContrasena } = req.body;

        const id = req.usuario.id;
        
        const validar_usuario = await Usuario.findById(id);


        if (!validar_usuario) {
            return res.status(404).json({
                ok: false,
                message: "El usuario no existe"
            })
        }

        const validar_contraseña = await bcrypt.compare(contrasenaActual, validar_usuario.contrasena);

        
        if (!validar_contraseña) {
            return res.status(401).json({
                ok: false,
                message: "Contraseña incorrecta"
            })
        }

        if (nuevaContrasena !== confirmarContrasena) {
            return res.status(400).json({
                ok: false,
                message: "Las contraseñas no coinciden"
            })
        }

        const encriptar_contraseña = await bcrypt.hash(nuevaContrasena, 10)

        validar_usuario.contrasena = encriptar_contraseña;

        await validar_usuario.save()

        return res.status(200).json({
            ok: true,
            message: "La contraseña fue cambiada con éxito",

        })




    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: "Error interno del servidor"
        });
    }
}