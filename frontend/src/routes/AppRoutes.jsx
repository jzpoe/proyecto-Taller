import { ClientesPage } from '../pages/ClientesPage'
import { EquiposPage } from '../pages/EquiposPage'
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
import { TecnicosPage } from '../pages/usuarios/TecnicosPage'


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

            {/* =========================
                RUTA PÚBLICA
            ========================== */}

            <Route
                path="/login"
                element={<LoginPage />}
            />


            {/* =========================
                RUTAS PROTEGIDAS
            ========================== */}

            <Route element={<ProtectedRoute />}>

                <Route element={<MainLayout />}>


                    {/* Dashboard según rol */}

                    <Route
                        path="/"
                        element={<DashboardPorRol />}
                    />


                    {/* =========================
                        RUTAS GENERALES
                    ========================== */}

                    <Route
                        path="/clientes"
                        element={<ClientesPage />}
                    />

                    <Route
                        path="/equipos"
                        element={<EquiposPage />}
                    />

                    <Route
                        path="/ordenes"
                        element={<OrdenesDeServicio />}
                    />

                    <Route
                        path="/ordenServicio/:id"
                        element={<DetalleOrdenServicioPage />}
                    />


                </Route>

            </Route>


            {/* =========================
                RUTAS EXCLUSIVAS ADMINISTRADOR
            ========================== */}

            <Route
                element={
                    <ProtectedRoute
                        rolRequerido="Administrador"
                    />
                }
            >

                <Route element={<MainLayout />}>

                    <Route
                        path="/tecnicos"
                        element={<TecnicosPage />}
                    />

                </Route>

            </Route>


        </Routes>

    );

};