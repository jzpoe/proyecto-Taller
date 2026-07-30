import { Upload, X } from "lucide-react";

export const ImageUploader = ({
    imagenes,
    setImagenes
}) => {

    const seleccionarImagenes = (e) => {

        const archivos = Array.from(e.target.files);

        setImagenes((prev) => [...prev, ...archivos]);

    };

    const eliminarImagen = (index) => {

        setImagenes((prev) =>
            prev.filter((_, i) => i !== index)
        );

    };

    return (

        <div className="space-y-4">

            <label className="block font-semibold text-gray-700">

                Fotografías del equipo

            </label>

            <label className="flex items-center justify-center gap-3 border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">

                <Upload />

                <span>

                    Seleccionar imágenes

                </span>

                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={seleccionarImagenes}
                    className="hidden"
                />

            </label>

            {
                imagenes.length > 0 && (

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">

                        {

                            imagenes.map((imagen, index) => (

                                <div
                                    key={index}
                                    className="relative group"
                                >

                                    <img

                                        src={URL.createObjectURL(imagen)}

                                        className="w-full h-32 object-cover rounded-lg border shadow"

                                    />

                                    <button

                                        type="button"

                                        onClick={() => eliminarImagen(index)}

                                        className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"

                                    >

                                        <X size={16} />

                                    </button>

                                </div>

                            ))

                        }

                    </div>

                )
            }

        </div>

    );

};