import Usuario from "../../models/usuario.model.js"
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"





const login = async (req, res) => {

    try {
        
        const { usuario, contrasena } = req.body;


        const usuarioRegistrado = await Usuario.findOne({ usuario });
        
        if (!usuarioRegistrado) {

            return res.status(404).json({

                ok: false,

                message: "Usuario no encontrado."

            });

        }

        const passwordCorrecta = await bcrypt.compare(

            contrasena,

            usuarioRegistrado.contrasena

        );

        if (!passwordCorrecta) {

            return res.status(401).json({

                ok: false,

                message: "Correo o Contraseña incorrectos."

            });

        }
        const token = jwt.sign(

            {
                id: usuarioRegistrado._id,

                nombre: usuarioRegistrado.nombre,

                rol: usuarioRegistrado.rol
            },

            process.env.JWT_SECRET,
            {

                expiresIn: "10s"

            }
        );
        return res.status(200).json({

            ok: true,
            message: "Inicio de sesión exitoso.",
            token,
            usuario: {
                
                nombre: usuarioRegistrado.nombre,
                usuario: usuarioRegistrado.usuario,
                rol: usuarioRegistrado.rol

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