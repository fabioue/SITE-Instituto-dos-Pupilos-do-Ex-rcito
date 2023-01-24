$(document).ready(function () {
    let bookingsX = JSON.parse(sessionStorage.getItem("bookings"));
    let minDateString = sessionStorage.getItem("dataMin");
    let maxDateString = sessionStorage.getItem("dataMax");
    var bookings = bookingsX[0];
    var minData = new Date(minDateString);
    var maxData = new Date(maxDateString);
    console.log(minDateString);

    if (minData != "Invalid Date" && maxData != "Invalid Date") {
        document.getElementById("title").innerHTML = "Relatório [" + minData.toLocaleDateString() + " - " + maxData.toLocaleDateString() + "]"
    } else if (minData == "Invalid Date" && maxData == "Invalid Date") {
        document.getElementById("title").innerHTML = "Relatório"
    } else if (minData == "Invalid Date" && maxData != "Invalid Date") {
        document.getElementById("title").innerHTML = "Relatório [" + "mais antigo" + " - " + maxData.toLocaleDateString() + "]"
    } else if (minData != "Invalid Date" && maxData == "Invalid Date") {
        document.getElementById("title").innerHTML = "Relatório [" + minData.toLocaleDateString() + " - " + "mais recente" + "]"
    }
    let almoco = 0, jantar = 0;

    for (var i = 0; i < bookingsX.length; i++) {
        if (bookingsX[i][6] == "Almoço") {
            almoco++;
        } else {
            jantar++;
        }
    }
    console.log(bookingsX);

    if (almoco == 0) {
        document.getElementById("info1").innerHTML = "Foram marcadas um total de <strong>" + bookingsX.length + " refeições (" + (jantar > 1 ? jantar + " jantares)</strong>." : "1 jantar)</strong>.");
    } else if (jantar == 0) {
        document.getElementById("info1").innerHTML = "Foram marcadas um total de <strong>" + bookingsX.length + " refeições (" + (almoco > 1 ? almoco + " almoços)</strong>." : "1 almoço)</strong>.");
    } else {
        document.getElementById("info1").innerHTML = "Foram marcadas um total de <strong>" + bookingsX.length + " refeições (" + (almoco > 1 ? almoco + " almoços" : almoco + " almoço") + " e " +(jantar > 1 ? jantar + " jantares)</strong>." : jantar + " jantar)</strong>.");
    }

    let consumidas = 0;
    for (var i = 0; i < bookingsX.length; i++) {
        if (bookingsX[i][8] == "Sim") {
            consumidas++;
        }
    }
    document.getElementById("info2").innerHTML = "Foram consumidas <strong>" + consumidas + " de " + bookingsX.length + "</strong> refeições.";

    var bookingsConsumidos = bookingsX.filter(function(value, index, array) {
        return value[8] == "Sim";
    });

    var bookingsNaoConsumidos = bookingsX.filter(function(value, index, array) {
        return value[8] != "Sim";
    });
    


    var tableConsumidas = $('#consumidas').DataTable({
        dom:
            "<'row'<'col-sm-14'lBftrp>>",
        renderer: 'bootstrap',
        buttons: [
            {
                extend: 'excel',
                text: "Excel <i class='fa fa-file-excel-o'></i>",
                title: "Refeições consumidas" + (minData != "Invalid Date" || maxData != "Invalid Date" ? (minData != "Invalid Date" ? "(" + minData.toLocaleDateString().replace("/", "-") : "(mais antiga - ") + (maxData != "Invalid Date" ? " - "+ maxData.toLocaleDateString().replace("/", "-") : " mais recente)") : ""),
                attr: {
                    id: "btnExcel",
                },
                exportOptions: {
                    columns: [2, 3, 4, 5, 6, 7, 8],
                }
            },
        ],
        pageLength: 5,
        lengthMenu: [[5, 10, 20, -1], [5, 10, 20, 'Todos']],
        language: {
            lengthMenu: "Mostrar  _MENU_  linhas",
            search: "Procurar",
            emptyTable: "Não existe nenhum registo nesta tabela",
            zeroRecords: "Nenhum registo encontrado",
            info: "A mostrar _END_ de _TOTAL_ registos",
            infoEmpty: "Não há registos para mostrar",
            infoFiltered: "(Pode mostrar _MAX_ registos)",
            paginate: {
                "first": "Primeiro",
                "last": "Ultimo",
                "next": "Próximo",
                "previous": "Anterior",
            },
        },

        data: bookingsConsumidos,
        columnDefs: [
            {
                targets: 0,
                visible: false,
            },
            {
                targets: 1,
                visible: false,
            },
        ],
    });

    var tableNConsumidas = $('#nconsumidas').DataTable({
        dom:
            "<'row'<'col-sm-14'lBftrp>>",
        renderer: 'bootstrap',
        buttons: [
            {
                extend: 'excel',
                text: "Excel <i class='fa fa-file-excel-o'></i>",
                title: "Refeições não consumidas" + (minData != "Invalid Date" || maxData != "Invalid Date" ? (minData != "Invalid Date" ? "(" + minData.toLocaleDateString().replace("/", "-") : "(mais antiga - ") + (maxData != "Invalid Date" ? " - "+ maxData.toLocaleDateString().replace("/", "-") : " mais recente)") : ""),
                attr: {
                    id: "btnExcel",
                },
                exportOptions: {
                    columns: [2, 3, 4, 5, 6, 7, 8],
                }
            },
        ],
        pageLength: 5,
        lengthMenu: [[5, 10, 20, -1], [5, 10, 20, 'Todos']],
        language: {
            lengthMenu: "Mostrar  _MENU_  linhas",
            search: "Procurar",
            emptyTable: "Não existe nenhum registo nesta tabela",
            zeroRecords: "Nenhum registo encontrado",
            info: "A mostrar _END_ de _TOTAL_ registos",
            infoEmpty: "Não há registos para mostrar",
            infoFiltered: "(Pode mostrar _MAX_ registos)",
            paginate: {
                "first": "Primeiro",
                "last": "Ultimo",
                "next": "Próximo",
                "previous": "Anterior",
            },
        },

        data: bookingsNaoConsumidos,
        columnDefs: [
            {
                targets: 0,
                visible: false,
            },
            {
                targets: 1,
                visible: false,
            },
        ],

    });

});