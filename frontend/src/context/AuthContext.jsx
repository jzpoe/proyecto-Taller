import { createContext } from "react";
import { useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [usuario, setUsuario] = useState(() => {

        const usuarioStorage = localStorage.getItem("usuario");

        return usuarioStorage
            ? JSON.parse(usuarioStorage)
            : null;

    });

    const [token, setToken] = useState(() => {

        return localStorage.getItem("token");

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