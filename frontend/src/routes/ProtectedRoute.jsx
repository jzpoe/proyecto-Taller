import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const ProtectedRoute = ({ rolRequerido }) => {

    const token = localStorage.getItem("token");

    const { usuario } = useAuth();

    if (!token) {

        return <Navigate to="/login" replace />;

    }

    if (
        rolRequerido &&
        usuario?.rol !== rolRequerido
    ) {

        return <Navigate to="/" replace />;

    }

    return <Outlet />;

};