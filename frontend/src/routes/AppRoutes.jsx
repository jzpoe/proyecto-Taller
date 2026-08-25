import { ClientesPage } from '../pages/ClientesPage'
import { EquiposPage } from '../pages/EquiposPage'
import { CrearClientePage } from '../pages/CrearClientePage'
import { Routes, Route } from 'react-router-dom'
import { MainLayout } from '../layouts/MainLayout'
import { DashboardPage } from '../DashboardPage/DashboardPage'
import { OrdenesDeServicio } from '../pages/equipo/OrdenesDeServicio'
import { DetalleOrdenServicioPage } from '../pages/detalleOrden/DetalleOrdenServicioPage'
import { LoginPage } from '../pages/login/LoginPage'
import { ProtectedRoute } from './ProtectedRoute'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { TecnicoDashboard } from '../pages/TecnicoDashboard'

const DashboardPorRol = () => {

    const { usuario } = useAuth();

    if (!usuario) {
        return <Navigate to="/login" replace />;
    }

    if (usuario.rol === "Tecnico") {
        return <TecnicoDashboard />;
    }

    return <DashboardPage />;
};

export const AppRoutes = () => {


    return (

        <Routes>
            {/* Ruta pública */}
            <Route path="/login" element={<LoginPage />} />

            {/* Rutas protegidas */}
            <Route element={<ProtectedRoute />}>

                <Route element={<MainLayout />}>

                    <Route path="/" element={<DashboardPorRol />} />
                    <Route path="/clientes" element={<ClientesPage />} />

                    <Route path="/equipos" element={<EquiposPage />} />

                    <Route path="/clientes/nuevo" element={<CrearClientePage />} />

                    <Route path="/ordenes" element={<OrdenesDeServicio />} />

                    <Route
                        path="/ordenServicio/:id"
                        element={<DetalleOrdenServicioPage />}
                    />

                </Route>

            </Route>

        </Routes>

    )

}