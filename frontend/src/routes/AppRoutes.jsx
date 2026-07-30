import { ClientesPage } from '../pages/ClientesPage'
import { EquiposPage } from '../pages/EquiposPage'
import { CrearClientePage } from '../pages/CrearClientePage'
import { Routes, Route } from 'react-router-dom'
import { MainLayout } from '../layouts/MainLayout'
import { DashboardPage } from '../DashboardPage/DashboardPage'
import { OrdenesDeServicio } from '../pages/equipo/OrdenesDeServicio'


export const AppRoutes = () => {
    

    return (
       
        <Routes>
            <Route element={<MainLayout/>}>
                <Route path="/" element={<DashboardPage  />} />
                <Route path='/clientes' element={<ClientesPage />} />
                <Route path='/equipos' element={<EquiposPage />} />
                <Route path='/clientes/nuevo' element={<CrearClientePage />} />
                <Route path='/ordenes' element={<OrdenesDeServicio/>} />
            </Route>
        </Routes>
       
    )

}