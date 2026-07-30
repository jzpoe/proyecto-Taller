import multer from "multer";
import path from "path";

// Configuración del almacenamiento
const storage = multer.diskStorage({

    destination(req, file, cb) {

        cb(null, "uploads/ordenes");

    },

    filename(req, file, cb) {

        const nombre =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1e9);

        cb(
            null,
            nombre + path.extname(file.originalname)
        );

    }

});

export const uploadImagenes = multer({

    storage,

    limits: {

        fileSize: 5 * 1024 * 1024

    },

    fileFilter(req, file, cb) {

        if (file.mimetype.startsWith("image/")) {

            cb(null, true);

        } else {

            cb(new Error("Solo se permiten imágenes"));

        }

    }

});