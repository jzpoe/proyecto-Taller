

export const CardDasboardClientes =(props)=>{

    return(
        
        <div className="bg-white rounded-lg shadow p-4 hover:shadow-lg hover:scale-105 transition">
             <h3 className="text-gray-500">{props.titulo}</h3>
            <p className="text-3xl font-bold">{props.valor}</p>

        </div>    
)

}