import OrdenServicio from "../models/ordenServicio.model.js";
import Usuario from "../models/usuario.model.js";

export const asignarTecnico = async (req, res) => {

    try {

        const { id } = req.params;
        const { tecnicoId } = req.body;

        // 1. Verificar que exista la orden
        const orden = await OrdenServicio.findById(id);

        if (!orden) {

            return res.status(404).json({
                ok: false,
                message: "Orden de servicio no encontrada."
            });

        }

        // 2. Verificar que se haya enviado un técnico
        if (!tecnicoId) {

            return res.status(400).json({
                ok: false,
                message: "Debe seleccionar un técnico."
            });

        }

        // 3. Buscar el usuario
        const tecnico = await Usuario.findById(tecnicoId);

        if (!tecnico) {

            return res.status(404).json({
                ok: false,
                message: "El usuario seleccionado no existe."
            });

        }

        // 4. Verificar que realmente sea Técnico
        if (tecnico.rol !== "Tecnico") {

            return res.status(400).json({
                ok: false,
                message: "El usuario seleccionado no es un técnico."
            });

        }

        // 5. Verificar que esté activo
        if (!tecnico.activo) {

            return res.status(400).json({
                ok: false,
                message: "El técnico seleccionado está inactivo."
            });

        }

        // 6. Asignar técnico
        orden.tecnicoAsignado = tecnico._id;

        await orden.save();

        // 7. Devolver la orden con el técnico
        await orden.populate(
            "tecnicoAsignado",
            "nombre usuario rol"
        );

        return res.status(200).json({
            ok: true,
            message: "Técnico asignado correctamente.",
            orden
        });

    } catch (error) {

        console.error("Error al asignar técnico:", error);

        return res.status(500).json({
            ok: false,
            message: "Error al asignar el técnico."
        });

    }

};