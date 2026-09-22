
import jsPDF from "jspdf";
import logo from "../assets/logo.png";


/* =====================================================
   TEXTO PARA EL INGRESO DEL EQUIPO
===================================================== */

const TEXTO_INGRESO = `El servicio técnico de 4Tech realizará la revisión del equipo. En caso de detectar trabajos previos o fallas no relacionadas con el servicio solicitado, se notificará oportunamente al cliente. No se asume responsabilidad por daños, modificaciones o desperfectos derivados de intervenciones anteriores o realizadas por terceros.

Asimismo, una vez notificado sobre la finalización del servicio, el cliente dispone de un plazo máximo de seis (6) meses para reclamar su equipo. Transcurrido este tiempo, no se asume responsabilidad por los equipos dejados en el local.`;


/* =====================================================
   COLORES
===================================================== */

// Azul de los encabezados
const AZUL = [30, 64, 175];

// Gris muy suave para bordes
const BORDE = [205, 210, 220];

// Fondo suave de las etiquetas
const FONDO_ETIQUETA = [248, 249, 251];

// Texto principal
const TEXTO = [45, 45, 45];

// Texto secundario
const TEXTO_SUAVE = [80, 80, 80];


/* =====================================================
   GENERAR PDF
===================================================== */

export const generarOrdenPDF = (orden) => {

    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
    });

    // Encabezado
    dibujarEncabezado(doc, orden);

    // Cliente + equipo
    dibujarDatosCliente(doc, orden);
    dibujarDatosEquipo(doc, orden);

    // Problema
    dibujarProblema(doc, orden);

    // Texto legal
    dibujarRecomendaciones(doc);

    // Pie
    dibujarPiePagina(doc);

    // Descargar
    doc.save(`${orden.numeroOrden}.pdf`);
};


/* =====================================================
   ENCABEZADO
===================================================== */

const dibujarEncabezado = (doc, orden) => {

    const x = 10;
    const y = 10;
    const ancho = 190;
    const alto = 35;

    /*
        Marco principal
    */

    doc.setDrawColor(...BORDE);
    doc.setLineWidth(0.35);

    doc.roundedRect(
        x,
        y,
        ancho,
        alto,
        3,
        3
    );


    /*
        Logo
    */

    doc.addImage(
        logo,
        "PNG",
        16,
        15,
        35,
        20
    );


    /*
        4TECH
    */

    doc.setTextColor(...AZUL);
    doc.setFont(
        "helvetica",
        "bold"
    );

    doc.setFontSize(18);

    doc.text(
        "4TECH",
        100,
        18,
        {
            align: "center"
        }
    );


    /*
        Subtítulo
    */

    doc.setTextColor(...TEXTO);
    doc.setFont(
        "helvetica",
        "normal"
    );

    doc.setFontSize(9);

    doc.text(
        "Reparación y Soporte Tecnológico",
        100,
        24,
        {
            align: "center"
        }
    );


    /*
        Título
    */

    doc.setTextColor(...AZUL);
    doc.setFont(
        "helvetica",
        "bold"
    );

    doc.setFontSize(13);

    doc.text(
        "ORDEN DE SERVICIO",
        100,
        31,
        {
            align: "center"
        }
    );


    /*
        Información de la orden
    */

    const fecha = orden.createdAt
        ? new Date(orden.createdAt)
            .toLocaleDateString("es-CO")
        : new Date()
            .toLocaleDateString("es-CO");


    doc.setTextColor(...TEXTO);
    doc.setFont(
        "helvetica",
        "normal"
    );

    doc.setFontSize(9);

    doc.text(
        `Orden: ${orden.numeroOrden || ""}`,
        150,
        18
    );

    doc.text(
        `Estado: ${orden.estado || ""}`,
        150,
        24
    );

    doc.text(
        `Fecha: ${fecha}`,
        150,
        30
    );
};


/* =====================================================
   DATOS DEL CLIENTE
===================================================== */

const dibujarDatosCliente = (doc, orden) => {

    const x = 10;
    const y = 52;

    const ancho = 92;

    const altoTitulo = 8;

    const altoTabla = 39;

    /*
        Título
    */

    dibujarTitulo(
        doc,
        x,
        y,
        ancho,
        "DATOS DEL CLIENTE"
    );


    /*
        Tabla
    */

    dibujarTabla(
        doc,
        x,
        y + altoTitulo,
        ancho,
        altoTabla,
        [
            "Nombre",
            "Teléfono",
            "Correo"
        ],
        [
            orden.cliente?.nombre || "",
            orden.cliente?.telefono || "",
            orden.cliente?.correo || ""
        ],
        3,
        30
    );
};


/* =====================================================
   DATOS DEL EQUIPO
===================================================== */

const dibujarDatosEquipo = (doc, orden) => {

    const x = 108;
    const y = 52;

    const ancho = 92;

    const altoTitulo = 8;

    const altoTabla = 39;

    /*
        Título
    */

    dibujarTitulo(
        doc,
        x,
        y,
        ancho,
        "DATOS DEL EQUIPO"
    );


    /*
        Tabla
    */

    dibujarTabla(
        doc,
        x,
        y + altoTitulo,
        ancho,
        altoTabla,
        [
            "Tipo",
            "Marca",
            "Modelo",
            "Serial"
        ],
        [
            orden.tipoEquipo || "",
            orden.marca || "",
            orden.modelo || "",
            orden.serial || ""
        ],
        4,
        30
    );
};


/* =====================================================
   TABLA INTERNA
===================================================== */

const dibujarTabla = (
    doc,
    x,
    y,
    ancho,
    alto,
    etiquetas,
    valores,
    cantidadFilas,
    anchoEtiqueta
) => {

    const altoFila =
        alto / cantidadFilas;


    /*
        Fondo de la columna de etiquetas
    */

    doc.setFillColor(
        ...FONDO_ETIQUETA
    );

    doc.rect(
        x,
        y,
        anchoEtiqueta,
        alto,
        "F"
    );


    /*
        Borde exterior
    */

    doc.setDrawColor(
        ...BORDE
    );

    doc.setLineWidth(0.3);

    doc.rect(
        x,
        y,
        ancho,
        alto
    );


    /*
        Línea vertical
    */

    doc.line(
        x + anchoEtiqueta,
        y,
        x + anchoEtiqueta,
        y + alto
    );


    /*
        Líneas horizontales
    */

    for (
        let i = 1;
        i < cantidadFilas;
        i++
    ) {

        const posicionY =
            y + altoFila * i;

        doc.line(
            x,
            posicionY,
            x + ancho,
            posicionY
        );
    }


    /*
        Texto
    */

    doc.setFontSize(8.5);


    for (
        let i = 0;
        i < cantidadFilas;
        i++
    ) {

        const posicionY =
            y +
            altoFila * i +
            altoFila / 2 +
            3;


        /*
            Etiqueta
        */

        doc.setFont(
            "helvetica",
            "bold"
        );

        doc.setTextColor(
            ...TEXTO
        );

        doc.text(
            etiquetas[i],
            x + 5,
            posicionY
        );


        /*
            Valor
        */

        doc.setFont(
            "helvetica",
            "normal"
        );

        doc.setTextColor(
            ...TEXTO_SUAVE
        );


        /*
            Permitimos que textos largos
            se ajusten dentro de la celda.
        */

        const textoValor =
            doc.splitTextToSize(
                valores[i],
                ancho - anchoEtiqueta - 8
            );


        doc.text(
            textoValor,
            x + anchoEtiqueta + 4,
            posicionY
        );
    }
};


/* =====================================================
   PROBLEMA REPORTADO
===================================================== */

const dibujarProblema = (
    doc,
    orden
) => {

    const x = 10;

    const y = 105;

    const ancho = 190;

    const altoTitulo = 8;

    const altoCaja = 35;


    /*
        Título
    */

    dibujarTitulo(
        doc,
        x,
        y,
        ancho,
        "PROBLEMA REPORTADO"
    );


    /*
        Caja
    */

    dibujarCajaSuave(
        doc,
        x,
        y + altoTitulo,
        ancho,
        altoCaja
    );


    /*
        Texto
    */

    doc.setFont(
        "helvetica",
        "normal"
    );

    doc.setFontSize(8.5);

    doc.setTextColor(
        ...TEXTO_SUAVE
    );


    const problema =
        doc.splitTextToSize(
            orden.problemaReportado ||
            "Sin información.",
            ancho - 12
        );


    doc.text(
        problema,
        x + 6,
        y + 18,
        {
            lineHeightFactor: 1.5
        }
    );
};


/* =====================================================
   RECOMENDACIONES
===================================================== */

const dibujarRecomendaciones = (
    doc
) => {

    const x = 10;

    const y = 150;

    const ancho = 190;

    const altoTitulo = 8;

    const altoCaja = 70;


    /*
        Título
    */

    dibujarTitulo(
        doc,
        x,
        y,
        ancho,
        "RECOMENDACIONES PARA INGRESOS"
    );


    /*
        Caja
    */

    dibujarCajaSuave(
        doc,
        x,
        y + altoTitulo,
        ancho,
        altoCaja
    );


    /*
        Texto legal
    */

    doc.setFont(
        "helvetica",
        "normal"
    );

    doc.setFontSize(8);

    doc.setTextColor(
        ...TEXTO_SUAVE
    );


    const texto =
        doc.splitTextToSize(
            TEXTO_INGRESO,
            ancho - 12
        );


    doc.text(
        texto,
        x + 6,
        y + 17,
        {
            lineHeightFactor: 1.5
        }
    );
};


/* =====================================================
   TÍTULO AZUL
===================================================== */

const dibujarTitulo = (
    doc,
    x,
    y,
    ancho,
    titulo
) => {

    doc.setFillColor(
        ...AZUL
    );


    doc.roundedRect(
        x,
        y,
        ancho,
        8,
        2,
        2,
        "F"
    );


    doc.setTextColor(
        255,
        255,
        255
    );

    doc.setFont(
        "helvetica",
        "bold"
    );

    doc.setFontSize(8.5);


    doc.text(
        titulo,
        x + 5,
        y + 5.5
    );
};


/* =====================================================
   CAJA SUAVE
===================================================== */

const dibujarCajaSuave = (
    doc,
    x,
    y,
    ancho,
    alto
) => {

    doc.setDrawColor(
        ...BORDE
    );

    doc.setLineWidth(
        0.3
    );


    doc.roundedRect(
        x,
        y,
        ancho,
        alto,
        1.5,
        1.5
    );
};


/* =====================================================
   PIE DE PÁGINA
===================================================== */

const dibujarPiePagina = (
    doc
) => {

    const altura =
        doc.internal.pageSize.height;


    /*
        Línea superior
    */

    doc.setDrawColor(
        ...BORDE
    );

    doc.setLineWidth(
        0.3
    );

    doc.line(
        10,
        altura - 22,
        200,
        altura - 22
    );


    /*
        Texto
    */

    doc.setTextColor(
        120,
        120,
        120
    );

    doc.setFont(
        "helvetica",
        "normal"
    );

    doc.setFontSize(8);


    doc.text(
        "Gracias por confiar en 4Tech",
        105,
        altura - 16,
        {
            align: "center"
        }
    );


    doc.text(
        "Servicio Técnico Especializado",
        105,
        altura - 12,
        {
            align: "center"
        }
    );


    doc.text(
        "Conserve este documento para reclamar su equipo.",
        105,
        altura - 8,
        {
            align: "center"
        }
    );
};

