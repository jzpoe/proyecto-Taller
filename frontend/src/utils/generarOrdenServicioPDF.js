
import logo from "../../src/assets/logo.png";
import jsPDF from "jspdf";

// =====================================================
// COLORES 4TECH
// =====================================================

const AZUL_FONDO = [220, 234, 247];
const AZUL_TEXTO = [31, 78, 121];
const GRIS_BORDE = [210, 216, 226];
const GRIS_TEXTO = [55, 65, 81];
const BLANCO = [255, 255, 255];

// =====================================================
// TEXTO DE GARANTÍA
// =====================================================

const TEXTO_GARANTIA = `Este producto cuenta con una garantía de un (1) mes a partir de la fecha de entrega. Cubre únicamente fallas derivadas del servicio de reparación y/o de las piezas reemplazadas. Se excluyen daños por golpes, rayones, humedad, sobrecarga eléctrica, manipulación inadecuada, desgaste natural o intervenciones de terceros. Para la validez y trámite de la garantía, será indispensable presentar este documento.`;

// =====================================================
// FUNCIÓN PRINCIPAL
// =====================================================

export const generarOrdenServicioPDF = (orden) => {

    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
    });

    let y = 10;

    // Encabezado
    y = dibujarEncabezado(doc, orden, y);

    // Cliente + equipo
    y = dibujarClienteEquipo(doc, orden, y);

    // Problema + diagnóstico
    y = dibujarProblemaDiagnostico(doc, orden, y);

    // Solución + resumen
    y = dibujarSolucionResumen(doc, orden, y);

    // Garantía
    y = dibujarBloqueTexto(
        doc,
        "GARANTÍA",
        TEXTO_GARANTIA,
        y
    );

    // Pie de página
    dibujarPiePagina(doc);

    // Guardar PDF
    doc.save(`${orden.numeroOrden || "orden-servicio"}.pdf`);
};


// =====================================================
// ENCABEZADO
// =====================================================

const dibujarEncabezado = (doc, orden, y) => {

    const x = 10;
    const ancho = 190;
    const alto = 35;

    // Fondo
    doc.setFillColor(...AZUL_FONDO);
    doc.roundedRect(
        x,
        y,
        ancho,
        alto,
        1.5,
        1.5,
        "F"
    );

    // Logo
    doc.addImage(
        logo,
        "PNG",
        20,
        y + 6,
        45,
        22
    );

    // Título
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(...AZUL_TEXTO);

    doc.text(
        "FORMATO DE ENTREGA",
        105,
        y + 20,
        {
            align: "center"
        }
    );

    // Información de la orden
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...GRIS_TEXTO);

    const fecha = orden.createdAt
        ? new Date(orden.createdAt).toLocaleDateString("es-CO")
        : new Date().toLocaleDateString("es-CO");

    doc.text(
        `Número de orden: ${orden.numeroOrden || ""}`,
        148,
        y + 11
    );

    doc.text(
        `Fecha: ${fecha}`,
        148,
        y + 17
    );

    doc.text(
        `Estado: ${orden.estado || ""}`,
        148,
        y + 23
    );

    return y + alto + 7;
};


// =====================================================
// TÍTULO DE BLOQUE
// =====================================================

const dibujarTituloBloque = (
    doc,
    titulo,
    x,
    y,
    ancho
) => {

    doc.setFillColor(...AZUL_FONDO);

    doc.roundedRect(
        x,
        y,
        ancho,
        9,
        1.5,
        1.5,
        "F"
    );

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(...AZUL_TEXTO);

    doc.text(
        titulo,
        x + ancho / 2,
        y + 6,
        {
            align: "center"
        }
    );
};


// =====================================================
// CAJA DE DATOS
// =====================================================

const dibujarTablaDatos = (
    doc,
    filas,
    x,
    y,
    ancho
) => {

    const alturaFila = 8;
    const altura = filas.length * alturaFila;

    // Caja
    doc.setFillColor(...BLANCO);
    doc.setDrawColor(...GRIS_BORDE);

    doc.roundedRect(
        x,
        y,
        ancho,
        altura,
        1,
        1,
        "FD"
    );

    // Ancho de columna izquierda
    const anchoEtiqueta = ancho * 0.38;

    filas.forEach((fila, index) => {

        const filaY = y + index * alturaFila;

        // Línea horizontal
        if (index > 0) {

            doc.setDrawColor(...GRIS_BORDE);

            doc.line(
                x,
                filaY,
                x + ancho,
                filaY
            );
        }

        // Línea vertical
        doc.line(
            x + anchoEtiqueta,
            filaY,
            x + anchoEtiqueta,
            filaY + alturaFila
        );

        // Fondo etiqueta
        doc.setFillColor(248, 249, 252);

        doc.rect(
            x,
            filaY,
            anchoEtiqueta,
            alturaFila,
            "F"
        );

        // Etiqueta
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(...GRIS_TEXTO);

        doc.text(
            fila[0],
            x + 3,
            filaY + 5
        );

        // Valor
        doc.setFont("helvetica", "normal");

        const valor = String(fila[1] || "");

        const lineas = doc.splitTextToSize(
            valor,
            ancho - anchoEtiqueta - 6
        );

        doc.text(
            lineas[0] || "",
            x + anchoEtiqueta + 3,
            filaY + 5
        );
    });

    return y + altura;
};


// =====================================================
// CLIENTE + EQUIPO
// =====================================================

const dibujarClienteEquipo = (
    doc,
    orden,
    y
) => {

    const margen = 10;
    const separacion = 6;

    const ancho =
        (190 - separacion) / 2;

    // -----------------------------
    // CLIENTE
    // -----------------------------

    dibujarTituloBloque(
        doc,
        "DATOS DEL CLIENTE:",
        margen,
        y,
        ancho
    );

    const finalCliente = dibujarTablaDatos(
        doc,
        [
            [
                "Nombre completo:",
                orden.cliente?.nombre || ""
            ],
            [
                "Teléfono:",
                orden.cliente?.telefono || ""
            ],
            [
                "Correo:",
                orden.cliente?.correo || ""
            ]
        ],
        margen,
        y + 9,
        ancho
    );

    // -----------------------------
    // EQUIPO
    // -----------------------------

    const xEquipo =
        margen + ancho + separacion;

    dibujarTituloBloque(
        doc,
        "DATOS DEL EQUIPO:",
        xEquipo,
        y,
        ancho
    );

    const marcaModelo = [
        orden.marca || "",
        orden.modelo || ""
    ]
        .filter(Boolean)
        .join(" ");

    const finalEquipo = dibujarTablaDatos(
        doc,
        [
            [
                "Tipo:",
                orden.tipoEquipo || ""
            ],
            [
                "Marca y modelo:",
                marcaModelo
            ],
            [
                "Serial:",
                orden.serial || ""
            ],
            [
                "Accesorios:",
                orden.accesoriosAdicionales ||
                orden.accesorios ||
                ""
            ]
        ],
        xEquipo,
        y + 9,
        ancho
    );

    return Math.max(
        finalCliente,
        finalEquipo
    ) + 7;
};


// =====================================================
// BLOQUE DE TEXTO
// =====================================================

const dibujarCajaTexto = (
    doc,
    texto,
    x,
    y,
    ancho,
    alturaMinima = 30
) => {

    const lineas = doc.splitTextToSize(
        String(texto || ""),
        ancho - 10
    );

    const altura =
        Math.max(
            alturaMinima,
            lineas.length * 4.2 + 10
        );

    // Caja
    doc.setFillColor(...BLANCO);
    doc.setDrawColor(...GRIS_BORDE);

    doc.roundedRect(
        x,
        y,
        ancho,
        altura,
        1,
        1,
        "FD"
    );

    // Texto
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...GRIS_TEXTO);

    doc.text(
        lineas,
        x + 5,
        y + 9
    );

    return y + altura;
};


// =====================================================
// PROBLEMA + DIAGNÓSTICO
// =====================================================

const dibujarProblemaDiagnostico = (
    doc,
    orden,
    y
) => {

    const margen = 10;
    const separacion = 6;

    const ancho =
        (190 - separacion) / 2;

    // Problema
    dibujarTituloBloque(
        doc,
        "PROBLEMA REPORTADO:",
        margen,
        y,
        ancho
    );

    const finalProblema = dibujarCajaTexto(
        doc,
        orden.problemaReportado ||
        "Sin información.",
        margen,
        y + 9,
        ancho,
        35
    );

    // Diagnóstico
    const xDiagnostico =
        margen + ancho + separacion;

    dibujarTituloBloque(
        doc,
        "DIAGNÓSTICO:",
        xDiagnostico,
        y,
        ancho
    );

    const finalDiagnostico = dibujarCajaTexto(
        doc,
        orden.diagnostico ||
        "Sin información.",
        xDiagnostico,
        y + 9,
        ancho,
        35
    );

    return Math.max(
        finalProblema,
        finalDiagnostico
    ) + 7;
};


// =====================================================
// SOLUCIÓN + RESUMEN
// =====================================================

const dibujarSolucionResumen = (
    doc,
    orden,
    y
) => {

    const margen = 10;
    const separacion = 6;

    const ancho =
        (190 - separacion) / 2;

    // Solución
    dibujarTituloBloque(
        doc,
        "SOLUCIÓN APLICADA:",
        margen,
        y,
        ancho
    );

    const finalSolucion = dibujarCajaTexto(
        doc,
        orden.solucion ||
        "Sin información.",
        margen,
        y + 9,
        ancho,
        35
    );

    // Resumen
    const xResumen =
        margen + ancho + separacion;

    dibujarTituloBloque(
        doc,
        "RESUMEN DEL SERVICIO:",
        xResumen,
        y,
        ancho
    );

    // const garantia =
    //     orden.garantia ||
    //     "1 mes";

    const resumen = [
        `Valor: $ ${Number(
            orden.valorCobro || 0
        ).toLocaleString("es-CO")}`,

        `Estado: ${orden.estado || ""}`,

        // `Garantía: ${garantia}`,

        `Observaciones: ${
            orden.observacionesEntrega ||
            "Sin observaciones."
        }`
    ].join("\n");

    const finalResumen = dibujarCajaTexto(
        doc,
        resumen,
        xResumen,
        y + 9,
        ancho,
        35
    );

    return Math.max(
        finalSolucion,
        finalResumen
    ) + 7;
};


// =====================================================
// GARANTÍA
// =====================================================

const dibujarBloqueTexto = (
    doc,
    titulo,
    texto,
    y
) => {

    const x = 10;
    const ancho = 190;

    dibujarTituloBloque(
        doc,
        titulo,
        x,
        y,
        ancho
    );

    const finalY = dibujarCajaTexto(
        doc,
        texto,
        x,
        y + 9,
        ancho,
        42
    );

    return finalY + 7;
};


// =====================================================
// PIE DE PÁGINA
// =====================================================

const dibujarPiePagina = (doc) => {

    const altura =
        doc.internal.pageSize.height;

    const x = 10;
    const y = altura - 25;
    const ancho = 190;
    const alto = 17;

    doc.setFillColor(...AZUL_FONDO);

    doc.roundedRect(
        x,
        y,
        ancho,
        alto,
        1,
        1,
        "F"
    );

    doc.setTextColor(...AZUL_TEXTO);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);

    doc.text(
        "Avenida 5 N° 23DN - 68, Barrio: San Vicente – Centro Comercial La Pasarela – Local 2-53",
        105,
        y + 6,
        {
            align: "center"
        }
    );

    doc.text(
        "Teléfono: 3175684157 – Email: 4tech.saje@gmail.com Cali - Valle",
        105,
        y + 12,
        {
            align: "center"
        }
    );
};

