import logo from "../../src/assets/logo.png";
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";

// Colores principales de 4Tech
const AZUL = [30, 64, 175];
const AZUL_OSCURO = [22, 50, 127];
const GRIS_BORDE = [210, 216, 226];
const GRIS_TEXTO = [55, 65, 81];

// Texto para equipos que ingresan al servicio
const TEXTO_INGRESO = `El servicio técnico de 4Tech realizará la revisión del equipo. En caso de detectar trabajos previos o fallas no relacionadas con el servicio solicitado, se notificará oportunamente al cliente. No se asume responsabilidad por daños, modificaciones o desperfectos derivados de intervenciones anteriores o realizadas por terceros.

Asimismo, una vez notificado sobre la finalización del servicio, el cliente dispone de un plazo máximo de seis (6) meses para reclamar su equipo. Transcurrido este tiempo, no se asume responsabilidad por los equipos dejados en el local.`;

// Texto de garantía
const TEXTO_GARANTIA = `Este producto cuenta con una garantía de un (1) mes a partir de la fecha de entrega. Cubre únicamente fallas derivadas del servicio de reparación y/o de las piezas reemplazadas. Se excluyen daños por golpes, rayones, humedad, sobrecarga eléctrica, manipulación inadecuada, desgaste natural o intervenciones de terceros. Para la validez y trámite de la garantía, será indispensable presentar este documento.`;



export const generarOrdenServicioPDF = (orden) => {

    const doc = new jsPDF("p", "mm", "a4");

    let y = 15;

    y = dibujarEncabezado(doc, orden, y);

    y = dibujarClienteEquipo(doc, orden, y);

    y = dibujarProblemaDiagnostico(doc, orden, y);

    y = dibujarSolucionResumen(doc, orden, y);

    y = dibujarBloqueTexto(
        doc,
        "RECOMENDACIONES PARA INGRESOS",
        TEXTO_INGRESO,
        y
    );

    y = dibujarBloqueTexto(
        doc,
        "GARANTÍA",
        TEXTO_GARANTIA,
        y
    );

    dibujarPiePagina(doc);

    doc.save(`${orden.numeroOrden}.pdf`);
};
const verificarEspacio = (doc, y, alturaNecesaria = 30) => {

    const alturaPagina = doc.internal.pageSize.height;

    if (y + alturaNecesaria > alturaPagina - 25) {

        doc.addPage();

        return 20;
    }

    return y;
};

export const dibujarEncabezado = (doc, orden, y) => {

    doc.setDrawColor(...GRIS_BORDE);
    doc.setFillColor(255, 255, 255);

    doc.roundedRect(
        10,
        y,
        190,
        32,
        3,
        3,
        "FD"
    );

    // Logo
    doc.addImage(
        logo,
        "PNG",
        15,
        y + 5,
        28,
        21
    );

    // Nombre de la empresa
    doc.setTextColor(...AZUL_OSCURO);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);

    doc.text(
        "4TECH",
        105,
        y + 8,
        { align: "center" }
    );

    // Descripción
    doc.setTextColor(...GRIS_TEXTO);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);

    doc.text(
        "Reparación y Soporte Tecnológico",
        105,
        y + 14,
        { align: "center" }
    );

    // Título
    doc.setTextColor(...AZUL_OSCURO);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);

    doc.text(
        "ORDEN DE SERVICIO",
        105,
        y + 23,
        { align: "center" }
    );

    // Información de la orden
    doc.setTextColor(...GRIS_TEXTO);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);

    doc.text(
        `Orden: ${orden.numeroOrden || ""}`,
        150,
        y + 8
    );

    doc.text(
        `Estado: ${orden.estado || ""}`,
        150,
        y + 14
    );

    doc.text(
        `Fecha: ${new Date(
            orden.createdAt
        ).toLocaleDateString("es-CO")}`,
        150,
        y + 20
    );

    return y + 40;
};
const dibujarTituloBloque = (
    doc,
    titulo,
    x,
    y,
    ancho
) => {

    doc.setFillColor(...AZUL);

    doc.roundedRect(
        x,
        y,
        ancho,
        8,
        1.5,
        1.5,
        "F"
    );

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);

    doc.text(
        titulo,
        x + 5,
        y + 5.2
    );

    doc.setTextColor(...GRIS_TEXTO);
};
const dibujarTablaSimple = (
    doc,
    filas,
    x,
    y,
    ancho
) => {

    autoTable(doc, {

        startY: y + 8,

        theme: "grid",

        body: filas,

        margin: {
            left: x,
            right: 200 - (x + ancho)
        },

        tableWidth: ancho,

        styles: {
            font: "helvetica",
            fontSize: 8.5,
            textColor: GRIS_TEXTO,
            cellPadding: 2.5,
            lineColor: GRIS_BORDE,
            lineWidth: 0.2
        },

        columnStyles: {

            0: {
                cellWidth: ancho * 0.34,
                fontStyle: "bold",
                fillColor: [248, 249, 252]
            },

            1: {
                cellWidth: ancho * 0.66
            }

        }

    });

    return doc.lastAutoTable.finalY;
};
export const dibujarClienteEquipo = (
    doc,
    orden,
    y
) => {

    y = verificarEspacio(
        doc,
        y,
        55
    );

    const margen = 10;

    const separacion = 4;

    const ancho =
        (190 - separacion) / 2;

    // Cliente
    dibujarTituloBloque(
        doc,
        "DATOS DEL CLIENTE",
        margen,
        y,
        ancho
    );

    // Equipo
    dibujarTituloBloque(
        doc,
        "DATOS DEL EQUIPO",
        margen + ancho + separacion,
        y,
        ancho
    );

    const finalCliente =
        dibujarTablaSimple(

            doc,

            [
                [
                    "Nombre",
                    orden.cliente?.nombre || ""
                ],

                [
                    "Teléfono",
                    orden.cliente?.telefono || ""
                ],

                [
                    "Correo",
                    orden.cliente?.correo || ""
                ]
            ],

            margen,
            y,
            ancho
        );

    const finalEquipo =
        dibujarTablaSimple(

            doc,

            [
                [
                    "Tipo",
                    orden.tipoEquipo || ""
                ],

                [
                    "Marca",
                    orden.marca || ""
                ],

                [
                    "Modelo",
                    orden.modelo || ""
                ],

                [
                    "Serial",
                    orden.serial || ""
                ]
            ],

            margen + ancho + separacion,
            y,
            ancho
        );

    return Math.max(
        finalCliente,
        finalEquipo
    ) + 4;
};
export const dibujarProblemaDiagnostico = (
    doc,
    orden,
    y
) => {

    y = verificarEspacio(
        doc,
        y,
        45
    );

    const margen = 10;

    const separacion = 4;

    const ancho =
        (190 - separacion) / 2;

    dibujarTituloBloque(
        doc,
        "PROBLEMA REPORTADO",
        margen,
        y,
        ancho
    );

    dibujarTituloBloque(
        doc,
        "DIAGNÓSTICO",
        margen + ancho + separacion,
        y,
        ancho
    );

    const finalProblema =
        dibujarTextoColumna(

            doc,

            orden.problemaReportado ||
            "Sin información.",

            margen,
            y,
            ancho
        );

    const finalDiagnostico =
        dibujarTextoColumna(

            doc,

            orden.diagnostico ||
            "Sin información.",

            margen + ancho + separacion,
            y,
            ancho
        );

    return Math.max(
        finalProblema,
        finalDiagnostico
    ) + 8;
};
export const dibujarSolucionResumen = (
    doc,
    orden,
    y
) => {

    y = verificarEspacio(
        doc,
        y,
        55
    );

    const margen = 10;

    const separacion = 4;

    const ancho =
        (190 - separacion) / 2;

    dibujarTituloBloque(
        doc,
        "SOLUCIÓN APLICADA",
        margen,
        y,
        ancho
    );

    dibujarTituloBloque(
        doc,
        "RESUMEN DEL SERVICIO",
        margen + ancho + separacion,
        y,
        ancho
    );

    const finalSolucion =
        dibujarTextoColumna(

            doc,

            orden.solucion ||
            "Sin información.",

            margen,
            y,
            ancho
        );

    const finalResumen =
        dibujarTablaSimple(

            doc,

            [
                [
                    "Valor",
                    `$ ${Number(
                        orden.valorCobro || 0
                    ).toLocaleString("es-CO")}`
                ],

                [
                    "Garantía",
                    orden.garantia ||
                    "Sin garantía"
                ],

                [
                    "Estado",
                    orden.estado || ""
                ],

                [
                    "Observaciones",
                    orden.observacionesEntrega ||
                    "Sin observaciones."
                ]
            ],

            margen + ancho + separacion,
            y,
            ancho
        );

    return Math.max(
        finalSolucion,
        finalResumen
    ) + 8;
};
const dibujarTextoColumna = (
    doc,
    texto,
    x,
    y,
    ancho
) => {

    const lineas =
        doc.splitTextToSize(
            texto,
            ancho - 10
        );

    const altura =
    Math.max(
        16,
        lineas.length * 4 + 6
    );

    doc.setDrawColor(...GRIS_BORDE);

    doc.rect(
        x,
        y + 8,
        ancho,
        altura
    );

    doc.setTextColor(...GRIS_TEXTO);

    doc.setFont(
        "helvetica",
        "normal"
    );

    doc.setFontSize(8);

    doc.text(
        lineas,
        x + 5,
        y + 16
    );

    return y + 8 + altura;
};
export const dibujarBloqueTexto = (
    doc,
    titulo,
    texto,
    y
) => {

    const lineas =
        doc.splitTextToSize(
            texto,
            180
        );

    const altura =
    Math.max(
        20,
        lineas.length * 3.8 + 8
    );

    y = verificarEspacio(
        doc,
        y,
        altura + 12
    );

    dibujarTituloBloque(
        doc,
        titulo,
        10,
        y,
        190
    );

    doc.setDrawColor(...GRIS_BORDE);

    doc.rect(
        10,
        y + 8,
        190,
        altura
    );

    doc.setTextColor(...GRIS_TEXTO);

    doc.setFont(
        "helvetica",
        "normal"
    );

    doc.setFontSize(7.5);

    doc.text(
        lineas,
        15,
        y + 15
    );

return y + 8 + altura + 4;
};
export const dibujarPiePagina = (doc) => {

    const altura =
        doc.internal.pageSize.height;

    doc.setDrawColor(...GRIS_BORDE);

    doc.line(
        10,
        altura - 18,
        200,
        altura - 18
    );

    doc.setTextColor(120);

    doc.setFontSize(7.5);

    doc.text(
        "Gracias por confiar en 4Tech",
        105,
        altura - 12,
        {
            align: "center"
        }
    );

    doc.text(
        "Conserve este documento para efectos de garantía.",
        105,
        altura - 7,
        {
            align: "center"
        }
    );
};