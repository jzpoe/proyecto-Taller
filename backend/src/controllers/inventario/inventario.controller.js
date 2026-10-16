

export const inventario = (req, res) => {
    try {
        const { nombre, categoria, variantes } = req.body;

        // 1. Validar los tipos de nombre y categoría
        if (typeof nombre !== "string" || typeof categoria !== "string") {
            return res.status(400).json({
                ok: false,
                message: "El nombre y la categoría deben ser textos."
            });
        }

        // 2. Eliminar espacios al principio y al final
        const nombreVariable = nombre.trim();
        const categoriaVariable = categoria.trim();

        // 3. Validar que no estén vacíos
        if (!nombreVariable || !categoriaVariable) {
            return res.status(400).json({
                ok: false,
                message: "El nombre y la categoría son obligatorios."
            });
        }

        // 4. Validar que variantes sea un arreglo
        if (!Array.isArray(variantes)) {
            return res.status(400).json({
                ok: false,
                message: "Las variantes deben enviarse como un arreglo."
            });
        }

        // 5. Validar que exista al menos una variante
        if (variantes.length === 0) {
            return res.status(400).json({
                ok: false,
                message: "Debes agregar al menos una variante."
            });
        }

        for (const variante of variantes) {
                
            if(typeof variante.stock !== "number" || !Number.isFinite(variante.stock) || variante.stock < 0 ){
                return res.status(400).json({
                ok: false,
                message: "Los datos deben ser numeros positivos, tipo numero y mayor a cero."

                
            })

        }

        // Por ahora, las validaciones terminan aquí.
        return res.status(200).json({
            ok: true,
            message: "Los datos básicos son válidos."
        });

        

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            ok: false,
            message: "Error interno del servidor."
        });
    }
};