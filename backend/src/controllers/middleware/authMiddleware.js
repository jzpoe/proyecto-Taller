import jwt from "jsonwebtoken";

export const verificarToken = (req, res, next) => {

    try {

        const authHeader = req.headers.authorization;

        // Verificamos que llegue el encabezado Authorization
        if (!authHeader) {

            return res.status(401).json({
                ok: false,
                message: "No hay token de autenticación."
            });

        }

        // Esperamos: Bearer TOKEN
        const partes = authHeader.split(" ");

        if (
            partes.length !== 2 ||
            partes[0] !== "Bearer"
        ) {

            return res.status(401).json({
                ok: false,
                message: "Formato de token inválido."
            });

        }

        const token = partes[1];

        // Verificamos el JWT
        const datosToken = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Guardamos los datos del usuario
        // para que estén disponibles en los controladores
        req.usuario = datosToken;

        next();

    } catch (error) {

        console.error("Error verificando token:", error.message);

        return res.status(401).json({
            ok: false,
            message: "Token inválido o expirado."
        });

    }

};

export const verificarAdministrador =(req,res,next)=>{

    if(req.usuario?.rol !="Administrador"){
        return res.status(403).json({
            ok: false,
            message:"No tiene permisos para realizar esta acción."
        })
    }
next()
}