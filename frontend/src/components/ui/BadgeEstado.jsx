

export const BadgeEstado = ({ estado }) => {

    let clases;

    if (estado === 'Disponible'){
        clases = "bg-green-400 inline-block rounded-full px-1 py-1 text-sm font-medium  text-black" 
    }else if (estado === 'Asignado') {
             clases = "bg-blue-300 inline-block rounded-full px-2 py-1 text-sm font-medium" 
    }else if (estado === 'En Reparacion') {
       clases = "bg-orange-400 inline-block rounded-full px-1 py-1 text-sm font-medium"
    }else if (estado === 'Dado de Baja'){
       clases = "bg-red-500 inline-block rounded-full px-1 py-1 text-sm font-medium" 
    }else if (estado === 'activo'){
       clases = "bg-green-500 inline-block rounded-full px-1 py-1 text-sm font-medium"
    }else if (estado === 'inactivo'){
       clases = "bg-red-500 inline-block rounded-full px-1 py-1 text-sm font-medium"
    }else if (estado === 'Pendiente Reparacion'){
       clases = "bg-amber-900 inline-block rounded-full px-1 py-1 text-sm font-medium text-white "
    }


    return (
        <div className={clases}>{estado}</div>
    )
}