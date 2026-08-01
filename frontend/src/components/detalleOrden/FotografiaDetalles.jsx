import { UserRound } from "lucide-react"


export const FotografiaDetalles = ({ orden }) => {
    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 border-b pb-4">
                <UserRound
                    className="text-blue-700"
                    size={28}
                />
                <h2 className="text-xl font-bold text-gray-800">
                    Evidencia
                </h2>
            </div>
            <div className="space-y-4 mt-5">
                <div>
                    <p className="text-sm text-gray-500">

                        Imagenes

                    </p>
                    <p className="font-semibold">

                        {
        orden.imagenes.length > 0 ?

            orden.imagenes.map((imagen, index) => (

                <img
                    key={index}
                    src={`http://localhost:3000/${imagen}`}
                    alt={`Imagen ${index + 1}`}
                    className="
                        w-full
                        h-40
                        object-cover
                        rounded-xl
                        border
                        shadow
                        hover:scale-105
                        transition
                        cursor-pointer
                    "
                />

            ))

            :

            <p>No hay imágenes registradas.</p>

    }
                           
                        

                    </p>
                </div>
            </div>



        </div>
    )

}