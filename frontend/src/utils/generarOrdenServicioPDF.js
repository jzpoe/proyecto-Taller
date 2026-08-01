import logo from "../../src/assets/logo.png";
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";

export const generarOrdenServicioPDF = (orden) => {

    const doc = new jsPDF("p", "mm", "a4");

    let y = 15;

    y = dibujarEncabezado(doc, orden, y);

    y = dibujarCliente(doc, orden, y);

    y = dibujarEquipo(doc, orden, y);

    y = dibujarBloqueTexto(
        doc,
        "PROBLEMA REPORTADO",
        orden.problemaReportado,
        [220,38,38],
        y
    );

    y = dibujarBloqueTexto(
        doc,
        "DIAGNÓSTICO",
        orden.diagnostico,
        [30,64,175],
        y
    );

    y = dibujarBloqueTexto(
        doc,
        "SOLUCIÓN APLICADA",
        orden.solucion,
        [22,163,74],
        y
    );

    y = dibujarResumen(doc,orden,y);

    dibujarPiePagina(doc);

    doc.save(`${orden.numeroOrden}.pdf`);

}
export const dibujarEncabezado=(doc,orden,y)=>{

    doc.setDrawColor(220);

    doc.roundedRect(10,y,190,32,3,3);

    doc.addImage(
        logo,
        "PNG",
        15,
        y+5,
        24,
        18
    );

    doc.setFont("helvetica","bold");

    doc.setFontSize(18);

    doc.text(
        "4TECH",
        105,
        y+8,
        {
            align:"center"
        }
    );

    doc.setFontSize(10);

    doc.setFont("helvetica","normal");

    doc.text(
        "Reparación y Soporte Tecnológico",
        105,
        y+14,
        {
            align:"center"
        }
    );

    doc.setFont("helvetica","bold");

    doc.setFontSize(15);

    doc.text(
        "ORDEN DE SERVICIO",
        105,
        y+23,
        {
            align:"center"
        }
    );

    doc.setFontSize(9);

    doc.setFont("helvetica","normal");

    doc.text(
        `Orden: ${orden.numeroOrden}`,
        150,
        y+8
    );

    doc.text(
        `Estado: ${orden.estado}`,
        150,
        y+14
    );

    doc.text(
        `Fecha: ${new Date(orden.createdAt).toLocaleDateString("es-CO")}`,
        150,
        y+20
    );

    return y+40;

}
export const dibujarCliente=(doc,orden,y)=>{

    doc.setFillColor(30,64,175);

    doc.rect(10,y,190,8,"F");

    doc.setTextColor(255);

    doc.setFont("helvetica","bold");

    doc.text("DATOS DEL CLIENTE",15,y+5);

    doc.setTextColor(0);

    autoTable(doc,{

        startY:y+8,

        theme:"grid",

        body:[

            ["Nombre",orden.cliente?.nombre||""],

            ["Teléfono",orden.cliente?.telefono||""],

            ["Correo",orden.cliente?.correo||""]

        ],

        margin:{left:10,right:10}

    });

    return doc.lastAutoTable.finalY+8;

}

export const dibujarEquipo = (doc, orden, y) => {

    doc.setFillColor(30,64,175);

    doc.rect(10,y,190,8,"F");

    doc.setTextColor(255);

    doc.setFont("helvetica","bold");

    doc.text("DATOS DEL EQUIPO",15,y+5);

    doc.setTextColor(0);

    autoTable(doc,{

        startY:y+8,

        theme:"grid",

        body:[

            ["Tipo",orden.tipoEquipo||""],

            ["Marca",orden.marca||""],

            ["Modelo",orden.modelo||""],

            ["Serial",orden.serial||""],

            ["Contraseña",orden.passwordEquipo||""]

        ],

        margin:{
            left:10,
            right:10
        }

    });

    return doc.lastAutoTable.finalY+8;

}

export const dibujarBloqueTexto=(doc,titulo,texto,color,y)=>{

    if(y>230){

        doc.addPage();

        y=20;

    }

    doc.setFillColor(...color);

    doc.rect(10,y,190,8,"F");

    doc.setTextColor(255);

    doc.setFont("helvetica","bold");

    doc.text(titulo,15,y+5);

    doc.setTextColor(0);

    const lineas=doc.splitTextToSize(

        texto||"Sin información.",

        180

    );

    const altura=lineas.length*6+8;

    doc.rect(10,y+8,190,altura);

    doc.setFont("helvetica","normal");

    doc.text(lineas,15,y+16);

    return y+altura+14;

}
export const dibujarResumen=(doc,orden,y)=>{

    autoTable(doc,{

        startY:y,

        theme:"grid",

        head:[["RESUMEN DEL SERVICIO",""]],

        body:[

            ["Valor",

                `$ ${Number(
                    orden.valorCobro||0
                ).toLocaleString("es-CO")}`
            ],

            ["Garantía",

                orden.garantia||"Sin garantía"
            ],

            ["Estado",

                orden.estado
            ],

            ["Observaciones",

                orden.observacionesEntrega||
                "Sin observaciones."
            ]

        ],

        headStyles:{

            fillColor:[30,64,175]

        },

        margin:{
            left:10,
            right:10
        }

    });

    return doc.lastAutoTable.finalY+10;

}


export const dibujarPiePagina=(doc)=>{

    const h=doc.internal.pageSize.height;

    doc.setDrawColor(180);

    doc.line(10,h-18,200,h-18);

    doc.setFontSize(8);

    doc.setTextColor(120);

    doc.text(

        "Gracias por confiar en 4Tech",

        105,

        h-12,

        {

            align:"center"

        }

    );

    doc.text(

        "Conserve este documento para efectos de garantía.",

        105,

        h-7,

        {

            align:"center"

        }

    );

}

