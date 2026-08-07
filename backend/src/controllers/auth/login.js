import Usuario from "../../models/usuario.model.js"
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"





const login = async (req, res) => {

    try {
        
        const { usuario, contrasena } = req.body;

        const Usuario = await Usuario.findOne({ usuario });

        if (!Usuario) {

            return res.status(404).json({

                ok: false,

                message: "Usuario no encontrado."

            });

        }

        const passwordCorrecta = await bcrypt.compare(

            contrasena,

            usuario.contrasena

        );

        if (!passwordCorrecta) {

            return res.status(401).json({

                ok: false,

                message: "Correo o Contraseña incorrectos."

            });

        }
        const token = jwt.sign(

            {
                id: Usuario._id,

                nombre: Usuario.nombre,

                rol: Usuario.rol
            },

            process.env.JWT_SECRET,
            {

                expiresIn: "8h"

            }
        );
        return res.status(200).json({

            ok: true,
            message: "Inicio de sesión exitoso.",
            token,
            Usuario: {
                id: Usuario._id,
                nombre: Usuario.nombre,
                correo: Usuario.correo,
                rol: Usuario.rol

            }

        });


    } catch (error) {

        console.error(error);

        return res.status(500).json({

            ok: false,

            message: "Error del servidor"

        });

    }

};

export { login }