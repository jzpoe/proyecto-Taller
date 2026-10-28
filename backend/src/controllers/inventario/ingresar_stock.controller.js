import mongoose from "mongoose";
import Inventario from "../../models/inventario.model.js";

export const ingresar_stock = async (req, res) => {
    try {
        const { id } = req.params;
        const { varianteId, cantidad } = req.body;

        if (!mongoose.isValidObjectId(id) ||
            !mongoose.isValidObjectId(varianteId)) {
            return res.status(400).json({
                ok: false,
                message: "El ID del producto o de la variante no es válido."
            });
        }

        if (!Number.isInteger(cantidad) || cantidad <= 0) {
            return res.status(400).json({
                ok: false,
                message: "La cantidad debe ser un entero mayor que cero."
            });
        }

        const producto = await Inventario.findOneAndUpdate(
            {
                _id: id,
                "variantes._id": varianteId
            },
            {
                $inc: {
                    "variantes.$.stock": cantidad
                }
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!producto) {
            return res.status(404).json({
                ok: false,
                message: "No se encontró el producto o la variante."
            });
        }

        const variante = producto.variantes.id(varianteId);

        return res.status(200).json({
            ok: true,
            message: "Stock ingresado correctamente.",
            producto: producto.nombre,
            variante: variante.atributos,
            stockActual: variante.stock
        });

    } catch (error) {
        console.error("Error al ingresar stock:", error);

        return res.status(500).json({
            ok: false,
            message: "Error interno al ingresar stock."
        });
    }
};