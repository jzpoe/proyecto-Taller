import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../assets/logo.png";

export const generarOrdenPDF = (orden) => {
    console.log("ORDEN PDF");

    console.log(orden);
    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
    });

    dibujarEncabezado(doc, orden);
    dibujarCliente(doc, orden);
    dibujarEquipo(doc, orden);
    dibujarProblema(doc, orden);
    dibujarObservaciones(doc, orden);
    dibujarFirmas(doc);
    dibujarPiePagina(doc);

    doc.save(`${orden.numeroOrden}.pdf`);
};

const dibujarEncabezado = (doc, orden) => {

    // Marco
    doc.setDrawColor(180);
    doc.rect(10, 10, 190, 35);

    // Logo
    doc.addImage(
        logo,
        "PNG",
        15,
        13,
        35,
        20
    );

    // Título
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);

    doc.text(
        "ORDEN DE RECEPCIÓN",
        105,
        18,
        { align: "center" }
    );

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    doc.text(
        "Servicio Técnico Especializado",
        105,
        24,
        { align: "center" }
    );

    // Fecha
    const fecha = orden.createdAt
        ? new Date(orden.createdAt).toLocaleDateString("es-CO")
        : new Date().toLocaleDateString("es-CO");

    doc.setFont("helvetica", "bold");

    doc.text(`Orden: ${orden.numeroOrden}`, 145, 18);
    doc.text(`Fecha: ${fecha}`, 145, 24);
    doc.text(`Estado: ${orden.estado}`, 145, 30);
};

const dibujarCliente = (doc, orden) => {

    const inicioY = 50;

    // Título
    doc.setFillColor(30, 64, 175);
    doc.rect(10, inicioY, 190, 8, "F");

    doc.setTextColor(255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);

    doc.text("DATOS DEL CLIENTE", 15, inicioY + 5.5);

    // Volver al color negro
    doc.setTextColor(0);

    // Caja
    doc.rect(10, inicioY + 8, 190, 30);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);

    doc.text("Nombre:", 15, inicioY + 16);
    doc.text("Teléfono:", 15, inicioY + 24);
    doc.text("Correo:", 15, inicioY + 32);

    doc.setFont("helvetica", "normal");

    doc.text(orden.cliente?.nombre || "", 45, inicioY + 16);
    doc.text(orden.cliente?.telefono || "", 45, inicioY + 24);
    doc.text(orden.cliente?.correo || "", 45, inicioY + 32);

};

const dibujarEquipo = (doc, orden) => {

    const inicioY = 92;

    doc.setFillColor(30, 64, 175);
    doc.rect(10, inicioY, 190, 8, "F");

    doc.setTextColor(255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);

    doc.text("DATOS DEL EQUIPO", 15, inicioY + 5.5);

    doc.setTextColor(0);

    doc.rect(10, inicioY + 8, 190, 48);

    doc.setFont("helvetica", "bold");

    doc.text("Tipo:", 15, inicioY + 16);
    doc.text("Marca:", 15, inicioY + 24);
    doc.text("Modelo:", 15, inicioY + 32);
    doc.text("Serial:", 15, inicioY + 40);
    doc.text("Contraseña:", 15, inicioY + 48);

    doc.setFont("helvetica", "normal");

    doc.text(orden.tipoEquipo || "", 50, inicioY + 16);
    doc.text(orden.marca || "", 50, inicioY + 24);
    doc.text(orden.modelo || "", 50, inicioY + 32);
    doc.text(orden.serial || "", 50, inicioY + 40);
    doc.text(orden.passwordEquipo || "", 50, inicioY + 48);

};

const dibujarProblema = (doc, orden) => {

    const inicioY = 152;

    doc.setFillColor(220, 38, 38);
    doc.rect(10, inicioY, 190, 8, "F");

    doc.setTextColor(255);
    doc.setFont("helvetica", "bold");

    doc.text("PROBLEMA REPORTADO", 15, inicioY + 5.5);

    doc.setTextColor(0);

    doc.rect(10, inicioY + 8, 190, 22);

    doc.setFont("helvetica", "normal");

    doc.text(
        orden.problemaReportado || "",
        15,
        inicioY + 18
    );

};

const dibujarObservaciones = (doc, orden) => {

    const inicioY = 186;

    doc.setFillColor(22, 163, 74);
    doc.rect(10, inicioY, 190, 8, "F");

    doc.setTextColor(255);
    doc.setFont("helvetica", "bold");

    doc.text("OBSERVACIONES", 15, inicioY + 5.5);

    doc.setTextColor(0);

    doc.rect(10, inicioY + 8, 190, 22);

    doc.setFont("helvetica", "normal");

    doc.text(
        orden.observacionesRecepcion || "Sin observaciones",
        15,
        inicioY + 18
    );

};

const dibujarFirmas = (doc) => {

    const y = 225;

    doc.rect(20, y, 70, 28);

    doc.rect(120, y, 70, 28);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);

    doc.text("Firma Cliente", 55, y + 33, {
        align: "center"
    });

    doc.text("Firma Técnico", 155, y + 33, {
        align: "center"
    });

};

const dibujarPiePagina = (doc) => {

    const altura = doc.internal.pageSize.height;

    doc.setDrawColor(200);

    doc.line(
        10,
        altura - 22,
        200,
        altura - 22
    );

    doc.setFontSize(8);

    doc.setTextColor(120);

    doc.text(
        "Gracias por confiar en TECH",
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
        "Conserve esta orden para reclamar su equipo.",
        105,
        altura - 8,
        {
            align: "center"
        }
    );

};