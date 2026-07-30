import { useState } from "react";
import { Check } from "lucide-react";
import toast from "react-hot-toast";
import { Input } from "../components/ui/Input";
import { TextareaEquipos } from "../components/TextareaEquipos";
import { crearOrdenServicio } from "../api/ordenServicio.api";
import { ImageUploader } from "../components/ui/ImageUploader";

export const FormularioOrdenServicio = ({ onCrearOrden }) => {

    const [imagenes, setImagenes] = useState([]);
    const [orden, setOrden] = useState({

        nombre: "",
        telefono: "",
        correo: "",

        tipoEquipo: "",
        marca: "",
        modelo: "",
        serial: "",

        problemaReportado: "",
        accesorios: "",
        observacionesRecepcion: "",
        passwordEquipo: ""

    });



    const handleChange = (e) => {

        const { name, value } = e.target;

        setOrden({

            ...orden,

            [name]: value

        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const formData = new FormData();

            // Agregar todos los campos del formulario
            Object.entries(orden).forEach(([key, value]) => {
                formData.append(key, value);
            });

            // Agregar todas las imágenes
            imagenes.forEach((imagen) => {
                formData.append("imagenes", imagen);
            });

            await crearOrdenServicio(formData);

            toast.success("Orden creada correctamente.");

            setOrden({
                nombre: "",
                telefono: "",
                correo: "",
                tipoEquipo: "",
                marca: "",
                modelo: "",
                serial: "",
                problemaReportado: "",
                accesorios: "",
                observacionesRecepcion: "",
                passwordEquipo: ""
            });

            setImagenes([]);

            if (onCrearOrden) {
                onCrearOrden();
            }

        } catch (error) {

            toast.error(
                error.response?.data?.mensaje ||
                "Error al crear la orden."
            );

        }

    };

    return (

        <div className="flex justify-center p-6">

            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-2 gap-4 w-full max-w-5xl"
            >

                <h2 className="col-span-2 text-xl font-bold border-b pb-2">

                    Datos del Cliente

                </h2>

                <Input
                    label="Teléfono"
                    name="telefono"
                    value={orden.telefono}
                    onChange={handleChange}
                />

                <Input
                    label="Nombre"
                    name="nombre"
                    value={orden.nombre}
                    onChange={handleChange}
                />

                <Input
                    label="Correo"
                    type="email"
                    name="correo"
                    value={orden.correo}
                    onChange={handleChange}
                />

                <div></div>

                <h2 className="col-span-2 text-xl font-bold border-b pb-2 mt-4">

                    Datos del Equipo

                </h2>

                <Input
                    label="Tipo Equipo"
                    name="tipoEquipo"
                    value={orden.tipoEquipo}
                    onChange={handleChange}
                />

                <Input
                    label="Marca"
                    name="marca"
                    value={orden.marca}
                    onChange={handleChange}
                />

                <Input
                    label="Modelo"
                    name="modelo"
                    value={orden.modelo}
                    onChange={handleChange}
                />

                <Input
                    label="Serial"
                    name="serial"
                    value={orden.serial}
                    onChange={handleChange}
                />

                <Input
                    label="Contraseña Equipo"
                    name="passwordEquipo"
                    value={orden.passwordEquipo}
                    onChange={handleChange}
                    className="col-span-2"
                />

                <TextareaEquipos
                    className="col-span-2"
                    label="Problema Reportado"
                    name="problemaReportado"
                    value={orden.problemaReportado}
                    onchange={handleChange}
                />

                <TextareaEquipos
                    className="col-span-2"
                    label="Accesorios"
                    name="accesorios"
                    value={orden.accesorios}
                    onchange={handleChange}
                />

                <TextareaEquipos
                    className="col-span-2"
                    label="Observaciones de Recepción"
                    name="observacionesRecepcion"
                    value={orden.observacionesRecepcion}
                    onchange={handleChange}
                />



                <ImageUploader

                    imagenes={imagenes}

                    setImagenes={setImagenes}

                />

                <div className="col-span-2 flex justify-end">

                    <button
                        type="submit"
                        className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded-lg"
                    >

                        Guardar Orden

                        <Check size={18} />

                    </button>

                </div>

            </form>

        </div>

    );

};