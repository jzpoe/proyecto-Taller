import { TextareaEquipos } from "../TextareaEquipos"
import { Input } from "../ui/Input"


export const ProcesoReparacionCard = ({ orden, handleChange, onGuardar }) => {

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <TextareaEquipos
                label="Diagnóstico"
                name="diagnostico"
                value={orden.diagnostico}
                onchange={handleChange}
            />

            <TextareaEquipos
                label="Solución"
                name="solucion"
                value={orden.solucion}
                onchange={handleChange}
            />

            <Input
                label="Valor del Servicio"
                name="valorCobro"
                type="number"
                value={orden.valorCobro}
                onChange={handleChange}
            />

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Garantía
                </label>

                <select
                    name="garantia"
                    value={orden.garantia}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-3"
                >
                    <option value="">Seleccione...</option>
                    <option value="30 días">30 días</option>
                    <option value="60 días">60 días</option>
                    <option value="90 días">90 días</option>
                    <option value="Sin garantía">Sin garantía</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado
                </label>

                <select
                    name="estado"
                    value={orden.estado}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-3"
                >
                    <option value="Recibido">Recibido</option>
                    <option value="En Diagnóstico">En Diagnóstico</option>
                    <option value="Esperando Aprobación">Esperando Aprobación</option>
                    <option value="Reparando">Reparando</option>
                    <option value="Listo para Entregar">Listo para Entregar</option>
                    <option value="Entregado">Entregado</option>
                </select>
            </div>

            <TextareaEquipos
                label="Observaciones de entrega"
                name="observacionesEntrega"
                value={orden.observacionesEntrega}
                onchange={handleChange}
            />
            <div className="flex justify-end mt-6">

                <button

                    onClick={onGuardar}

                    className="
            bg-blue-700
            hover:bg-blue-800
            text-white
            px-6
            py-3
            rounded-xl
            shadow-lg
            transition
            hover:scale-105
        "

                >

                    💾 Guardar Cambios

                </button>

            </div>
        </div>
    )


}