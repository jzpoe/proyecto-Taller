import { UserRound } from "lucide-react"


export const ProblemaDetalles =({orden})=>{
    return(
        
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">

            <div className="flex items-center gap-3 border-b pb-4">

                <UserRound
                    className="text-blue-700"
                    size={28}
                />

                <h2 className="text-xl font-bold text-gray-800">

                    Problema reportado

                </h2>

            </div>

            <div className="space-y-4 mt-5">

                <div>

                    <p className="text-sm text-gray-500">

                       Falla

                    </p>

                    <p className="font-semibold">

                        {orden.problemaReportado}

                    </p>

                </div>
                

            </div>

        </div>
        
    )
}