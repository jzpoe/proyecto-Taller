import { createContext } from "react";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

const tokenValido = (token) => {

    if (!token) {
        return false;
    }

    try {

        const datosToken = jwtDecode(token);

        const tiempoActual = Date.now() / 1000;

        return datosToken.exp > tiempoActual;

    } catch (error) {

        console.error("Token inválido:", error);

        return false;

    }

};

export const AuthProvider = ({ children }) => {
    const [usuario, setUsuario] = useState(() => {

          const tokenGuardado =
        localStorage.getItem("token");

    const usuarioStorage =
        localStorage.getItem("usuario");

    if (
        !tokenGuardado ||
        !tokenValido(tokenGuardado)
    ) {

        localStorage.removeItem("token");
        localStorage.removeItem("usuario");

        return null;

    }

    return usuarioStorage
        ? JSON.parse(usuarioStorage)
        : null;

});

    const [token, setToken] = useState(() => {

        const tokenGuardado = localStorage.getItem("token");

    if (!tokenGuardado) {
        return null;
    }

    if (!tokenValido(tokenGuardado)) {

        localStorage.removeItem("token");
        localStorage.removeItem("usuario");

        return null;
    }

    return tokenGuardado;

    });

    const login = (datos) => {

        setUsuario(datos.usuario);

        setToken(datos.token);

        localStorage.setItem(
            "usuario",
            JSON.stringify(datos.usuario)
        );

        localStorage.setItem(
            "token",
            datos.token
        );



    };

    const logout = () => {

        setUsuario(null);

        setToken(null);

        localStorage.removeItem("usuario");

        localStorage.removeItem("token");

    };

    return (

    <AuthContext.Provider

        value={{

            usuario,

            token,

            login,

            logout

        }}

    >

        {children}

    </AuthContext.Provider>

);

};