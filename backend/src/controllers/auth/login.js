import Usuario from "../../models/usuario.model.js"
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"





const login = async (req, res) => {

    try {
        console.log("====== ENTRÓ AL LOGIN ======");
        console.log(req.body);
        const { correo, contrasena } = req.body;

        const usuario = await Usuario.findOne({ correo });

        if (!usuario) {

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
                id: usuario._id,

                nombre: usuario.nombre,

                rol: usuario.rol
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
            usuario: {
                id: usuario._id,
                nombre: usuario.nombre,
                correo: usuario.correo,
                rol: usuario.rol

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