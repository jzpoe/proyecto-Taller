
import jsPDF from "jspdf";
import logo from "../assets/logo.png";

// =====================================================
// CONFIGURACIÓN VISUAL
// =====================================================

const AZUL_FONDO = [220, 234, 247];   // Azul claro del diseño
const AZUL_TEXTO = [31, 78, 121];     // Azul oscuro de títulos
const TEXTO = [25, 25, 25];
const BORDE = [220, 220, 220];

const MARGEN = 10;
const ANCHO = 190;

// Texto legal
const TEXTO_INGRESO = `El servicio técnico de 4Tech realizará la revisión del equipo. En caso de detectar trabajos previos o fallas no relacionadas con el servicio solicitado, se notificará oportunamente al cliente. No se asume responsabilidad por daños, modificaciones o desperfectos derivados de intervenciones anteriores o realizadas por terceros.

Asimismo, una vez notificado sobre la finalización del servicio, el cliente dispone de un plazo máximo de seis (6) meses para reclamar su equipo. Transcurrido este tiempo, no se asume responsabilidad por los equipos dejados en el local.`;

// =====================================================
// FUNCIÓN PRINCIPAL
// =====================================================

export const generarOrdenPDF = (orden) => {

    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
    });

    // -------------------------------------------------
    // ENCABEZADO
    // -------------------------------------------------

    dibujarEncabezado(doc, orden);

    // -------------------------------------------------
    // DATOS CLIENTE + EQUIPO
    // -------------------------------------------------

    dibujarDatosCliente(doc, orden);
    dibujarDatosEquipo(doc, orden);

    // -------------------------------------------------
    // MOTIVO DE INGRESO
    // -------------------------------------------------

    dibujarMotivoIngreso(doc, orden);

    // -------------------------------------------------
    // ESTADO FÍSICO
    // -------------------------------------------------

    dibujarEstadoFisico(doc, orden);

    // -------------------------------------------------
    // NOTA LEGAL
    // -------------------------------------------------

    dibujarNota(doc);

    // -------------------------------------------------
    // PIE DE PÁGINA
    // -------------------------------------------------

    dibujarPiePagina(doc);

    // -------------------------------------------------
    // GUARDAR
    // -------------------------------------------------

    doc.save(`${orden.numeroOrden || "orden-servicio"}.pdf`);
};


// =====================================================
// ENCABEZADO
// =====================================================

const dibujarEncabezado = (doc, orden) => {

    const x = MARGEN;
    const y = 10;
    const w = ANCHO;
    const h = 35;

    // Fondo azul claro
    doc.setFillColor(...AZUL_FONDO);
    doc.roundedRect(x, y, w, h, 0, 0, "F");

    // Logo
    doc.addImage(
        logo,
        "PNG",
        22,
        14,
        55,
        23
    );

    // Título central
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(...AZUL_TEXTO);

    doc.text(
        "FORMATO DE INGRESO",
        105,
        24,
        { align: "center" }
    );

    // Información derecha
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(...AZUL_TEXTO);

    const fecha = orden.createdAt
        ? new Date(orden.createdAt).toLocaleDateString("es-CO")
        : new Date().toLocaleDateString("es-CO");

    doc.text(
        `Número de orden: ${orden.numeroOrden || ""}`,
        148,
        16
    );

    doc.text(
        `Fecha de ingreso: ${fecha}`,
        148,
        22
    );

    doc.text(
        `Estado: ${orden.estado || "Recibido"}`,
        148,
        28
    );
};


// =====================================================
// DATOS DEL CLIENTE
// =====================================================

const dibujarDatosCliente = (doc, orden) => {

    const x = MARGEN;
    const y = 50;
    const w = 92;
    const h = 45;

    // Caja
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(...BORDE);
    doc.roundedRect(x, y, w, h, 1, 1, "FD");

    // Título
    doc.setFillColor(...AZUL_FONDO);
    doc.roundedRect(x, y, w, 9, 1, 1, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...AZUL_TEXTO);

    doc.text(
        "DATOS DEL CLIENTE:",
        x + w / 2,
        y + 6,
        { align: "center" }
    );

    // Datos
    doc.setFontSize(9.5);
    doc.setTextColor(...TEXTO);

    const datos = [
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
    ];

    let posicionY = y + 19;

    datos.forEach(([etiqueta, valor]) => {

        doc.setFont("helvetica", "normal");

        doc.text(
            etiqueta,
            x + 1,
            posicionY
        );

        doc.text(
            valor,
            x + 40,
            posicionY
        );

        posicionY += 8;
    });
};


// =====================================================
// DATOS DEL EQUIPO
// =====================================================

const dibujarDatosEquipo = (doc, orden) => {

    const x = 108;
    const y = 50;
    const w = 92;
    const h = 45;

    // Caja
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(...BORDE);
    doc.roundedRect(x, y, w, h, 1, 1, "FD");

    // Título
    doc.setFillColor(...AZUL_FONDO);
    doc.roundedRect(x, y, w, 9, 1, 1, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...AZUL_TEXTO);

    doc.text(
        "DATOS DEL EQUIPO:",
        x + w / 2,
        y + 6,
        { align: "center" }
    );

    // Datos
    doc.setFontSize(9.5);
    doc.setTextColor(...TEXTO);

    const marcaModelo = [
        orden.marca || "",
        orden.modelo || ""
    ]
        .filter(Boolean)
        .join(" ");

    const accesorios =
        orden.accesorios ||
        "";

    const datos = [
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
            "Accesorios adicionales:",
            accesorios
        ]
    ];

    let posicionY = y + 17;

    datos.forEach(([etiqueta, valor]) => {

        doc.setFont("helvetica", "normal");

        doc.text(
            etiqueta,
            x + 1,
            posicionY
        );

        doc.text(
            valor,
            x + 40,
            posicionY
        );

        posicionY += 8;
    });
};


// =====================================================
// MOTIVO DE INGRESO
// =====================================================

const dibujarMotivoIngreso = (doc, orden) => {

    const x = MARGEN;
    const y = 100;
    const w = ANCHO;
    const h = 52;

    // Caja principal
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(...BORDE);
    doc.roundedRect(x, y, w, h, 1, 1, "FD");

    // Título
    doc.setFillColor(...AZUL_FONDO);
    doc.roundedRect(x, y, w, 9, 1, 1, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...AZUL_TEXTO);

    doc.text(
        "MOTIVO DE INGRESO:",
        x + w / 2,
        y + 6,
        { align: "center" }
    );

    // Problema
    const problema =
        orden.problemaReportado ||
        "Sin información registrada.";

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(...TEXTO);

    const lineas = doc.splitTextToSize(
        problema,
        w - 10
    );

    doc.text(
        lineas,
        x + 5,
        y + 18
    );
};


// =====================================================
// ESTADO FÍSICO DEL EQUIPO
// =====================================================

const dibujarEstadoFisico = (doc, orden) => {
    const x = MARGEN;
    const y = 158;
    const w = ANCHO;
    const h = 52;

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(...BORDE);
    doc.roundedRect(x, y, w, h, 1, 1, "FD");

    // Título
    doc.setFillColor(...AZUL_FONDO);
    doc.roundedRect(x, y, w, 9, 1, 1, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...AZUL_TEXTO);

    doc.text(
        "ESTADO FÍSICO DEL EQUIPO:",
        x + w / 2,
        y + 6,
        { align: "center" }
    );

    // AQUÍ toma exactamente lo escrito en el Textarea
    const estadoFisico = orden.observacionesRecepcion || "";

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(...TEXTO);

    const lineas = doc.splitTextToSize(
        estadoFisico,
        w - 10
    );

    doc.text(
        lineas,
        x + 5,
        y + 18
    );
};


// =====================================================
// NOTA LEGAL
// =====================================================

const dibujarNota = (doc) => {

    const x = MARGEN;
    const y = 225;
    const w = ANCHO;
    const h = 30;

    // Fondo azul claro
    doc.setFillColor(...AZUL_FONDO);
    doc.roundedRect(x, y, w, h, 1, 1, "F");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...AZUL_TEXTO);

    // "NOTA:" en negrita
    doc.setFont("helvetica", "bold");

    doc.text(
        "NOTA:",
        x + 2,
        y + 2.7
    );

    // Texto legal
    doc.setFont("helvetica", "normal");

    const texto = doc.splitTextToSize(
        TEXTO_INGRESO,
        w - 8
    );

    doc.text(
        texto,
        x + 9,
        y + 6
    );
};


// =====================================================
// PIE DE PÁGINA
// =====================================================

const dibujarPiePagina = (doc) => {

    const x = MARGEN;
    const y = 260;
    const w = ANCHO;
    const h = 27;

    // Fondo azul claro
    doc.setFillColor(...AZUL_FONDO);
    doc.roundedRect(x, y, w, h, 1, 1, "F");

    doc.setTextColor(...AZUL_TEXTO);

    // Primera línea
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);

    doc.text(
        "Avenida 5 N° 23DN - 68, Barrio: San Vicente – Centro Comercial La Pasarela – Local 2-53",
        105,
        y + 8,
        { align: "center" }
    );

    // Segunda línea
    doc.text(
        "Teléfono: 3175684157 – Email: 4tech.saje@gmail.com Cali - Valle",
        105,
        y + 17,
        { align: "center" }
    );
};

