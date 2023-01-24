var regimeForm = document.getElementById("regimeForm");
var nForm = document.getElementById("numeroForm");
var emailForm = document.getElementById("emailForm");
var nifForm = document.getElementById("nifForm");
var tipoForm = document.getElementById("tipoForm");
var emailInput = document.getElementById("email");
var tipoInput = document.getElementById("type");
var regimeInput = document.getElementById("regime");
var nInput = document.getElementById("num");
var nifInput = document.getElementById("nif");
regimeForm.style.display = "none"
nForm.style.display = "none"

var logsRef = db.ref().child("server/logs/");
var bookingsRef = db.ref().child("server/bookings/");
var useremail = sessionStorage.getItem("email");

$('#modalAltaEdicion').on('hidden.bs.modal', function (e) {
    regimeForm.style.display = "none"
    nForm.style.display = "none"
    nForm.setAttribute("required", "");
    nForm.removeAttribute("disable");
    emailInput.setAttribute("required", "");
    emailInput.removeAttribute("disabled");
    nifInput.setAttribute("required", "");
    nifInput.removeAttribute("disabled");
    tipoInput.setAttribute("required", "");
    tipoInput.removeAttribute("disabled");
    nInput.setAttribute("required", "");
    nInput.removeAttribute("disabled");
    emailForm.style.display = "initial";

})





document.getElementsByTagName('select')[0].onchange = function () {
    var index = this.selectedIndex;
    var inputText = this.children[index].innerHTML.trim();
    console.log(inputText);
    if (inputText != "Aluno") {
        regimeForm.style.display = "none";
        nForm.style.display = "initial";
        document.getElementById("nNimLabel").innerHTML = "NIM";
        document.getElementById("num").min = 100000000;
        document.getElementById("num").max = 999999999;
    } else {
        regimeForm.style.display = "initial";
        nForm.style.display = "initial";
        document.getElementById("nNimLabel").innerHTML = "Nº do aluno/a";
        document.getElementById("num").min = 0001;
        document.getElementById("num").max = 9999;
    }
}

var filaEliminada;

const iconoEditar = '<svg class="bi bi-pencil-square" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/></svg>';
const iconoBorrar = '<svg class="bi bi-trash" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>';
var db = firebase.database();
var verifiedUsers = db.ref().child("server/verifiedUsers");
var unverifiedUsers = db.ref().child("server/unverifiedUsers");
var bookings = db.ref().child("server/bookings");

var dataSet = [];
var table = $('#tabela').DataTable({
    dom:
        "<'row'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>>" +
        "<'row'<'col-sm-12'itrpB>>",
    renderer: 'bootstrap',
    buttons: [
        {
            text: "<i class='fa-solid fa-plus'></i>",
            attr: {
                id: "btnNovo"
            }
        },
        {
            extend: 'excel',
            text: "Excel <i class='fa fa-file-excel-o'></i>",
            attr: {
                id: "btnExcel",
            },
            exportOptions: {
                columns: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                orthogonal: 'export',
            },
        },
        {
            text: "Importar CSV <i class='fa-solid fa-file-csv'></i>",
            attr: {
                id: "btnCsv",
            },
            action: function (e, dt, node, config) {
                role = sessionStorage.getItem("role");
                if (role == "superadmin") {
                    Swal.fire({
                        title: 'Tem a certeza que quer importar um ficheiro csv?',
                        text: "Esta operação irá apagar todos os registos (utilizadores e marcações)!",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: 'green',
                        cancelButtonColor: 'red',
                        confirmButtonText: 'Importar',
                        cancelButtonText: 'Cancelar'
                    }).then((result) => {
                        if (result.value) {

                            document.getElementById("file").click();
                            let csvText = "";

                            $("#file").change(function (e) {
                                if (this.files[0].type == "text/csv") {
                                    var fr = new FileReader();
                                    fr.onload = function () {
                                        csvText = fr.result;
                                        var lines = csvText.split("\n");
                                        var result = [];
                                        var headers = lines[0].split(",");
                                        console.log(headers);
                                        if (lines[0] == "id,nif,nome,num,regime,tipo,tickets,dieta,vegetariano\r" || lines[0] == "id,nif,nome,num,regime,tipo,tickets,dieta,vegetariano") {
                                            verifiedUsers.remove();
                                            unverifiedUsers.remove();
                                            bookings.remove();
                                            for (var i = 1; i < lines.length; i++) {
                                                var currentline = lines[i].split(",");
                                                let id = currentline[0];
                                                let nif = currentline[1];
                                                let nome = currentline[2];
                                                let num = currentline[3];
                                                let regime = currentline[4];
                                                let tipo = currentline[5];
                                                let tickets = currentline[6];
                                                let dieta = currentline[7];
                                                let vegetariano = currentline[8];
                                                var verifiedUser = db.ref().child("server/verifiedUsers/" + id + "/");
                                                console.log(id);
                                                verifiedUser.set({
                                                    "nif": nif,
                                                    "name": nome,
                                                    "num": num,
                                                    "regime": regime,
                                                    "type": tipo,
                                                    "tickets": tickets,
                                                    "dieta": dieta,
                                                    "vegetariano": vegetariano,
                                                });

                                            }
                                        } else {
                                            alert("Cabeçalho inválido").then((e) => {
                                                fr.readAsText(this.files[0]);
                                                location.reload();
                                            })
                                        }

                                        //console.log(JSON.stringify(result));
                                    }
                                    fr.readAsText(this.files[0]);
                                    location.reload();
                                } else {
                                    alert("Ficheiro inválido")
                                }
                            });
                        }
                    });
                } else {
                    alert("Esta conta não tem permissão para fazer esta ação.")
                }


            }
        }

    ],

    pageLength: 5,
    lengthMenu: [[5, 10, 20, -1], [5, 10, 20, 'Todas']],
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

    columns: [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        {
            data: null,
            render: function (row, type, data) {
                if (type === 'export') {
                    return data[9] === "Sim" ? "Sim" : "Não";
                }
                if (data[9] === 'Sim') {
                    return "<i class='fa-solid fa-check'></i>";
                } else {
                    return "<i class='fa-solid fa-xmark'></i>";
                }
            },
        },
        null,
    ],
    data: dataSet,
    columnDefs: [
        {
            targets: [0],
            visible: false,
            search: false,
        },
        {
            targets: -1,
            defaultContent: "<div class='wrapper text-center'><div class='btn-group'><button id='editar' class='btnEditar btn btn-primary' data-toggle='tooltip' title='Editar'>" + iconoEditar + "</button><button class='btnBorrar btn btn-danger' data-toggle='tooltip' title='Apagar'>" + iconoBorrar + "</button></div></div>"
        },
    ],
});

verifiedUsers.on("child_added", datos => {
    dataSet = [datos.key, datos.child("nif").val(), datos.child("name").val(), datos.child("num").val(), datos.child("regime").val() == null || datos.child("regime").val() == "null" ? "N/A" : datos.child("regime").val(), datos.child("type").val(), datos.child("tickets").val(), datos.child("dieta").val() == "true" ? "Sim" : "Não", datos.child("vegetariano").val() == "true" ? "Sim" : "Não", "Sim"];
    table.rows.add([dataSet]).draw();
});
verifiedUsers.on('child_changed', datos => {
    dataSet = [datos.key, datos.child("nif").val(), datos.child("name").val(), datos.child("num").val(), datos.child("regime").val() == null || datos.child("regime").val() == "null" ? "N/A" : datos.child("regime").val(), datos.child("type").val(), datos.child("tickets").val(), datos.child("dieta").val() == "true" ? "Sim" : "Não", datos.child("vegetariano").val() == "true" ? "Sim" : "Não", "Sim"];
    table.row(filaEditada).data(dataSet).draw();
});
verifiedUsers.on("child_removed", function () {
    table.row(filaEliminada.parents('tr')).remove().draw();
});

unverifiedUsers.on("child_added", datos => {
    dataSet = [datos.key, datos.child("nif").val(), datos.child("name").val(), datos.child("num").val(), datos.child("regime").val() == null || datos.child("regime").val() == "null" ? "N/A" : datos.child("regime").val(), datos.child("type").val(), datos.child("tickets").val(), datos.child("dieta").val() == "true" ? "Sim" : "Não", datos.child("vegetariano").val() == "true" ? "Sim" : "Não", "Não"];
    table.rows.add([dataSet]).draw();
});
unverifiedUsers.on('child_changed', datos => {
    dataSet = [datos.key, datos.child("nif").val(), datos.child("name").val(), datos.child("num").val(), datos.child("regime").val() == null || datos.child("regime").val() == "null" ? "N/A" : datos.child("regime").val(), datos.child("type").val(), datos.child("tickets").val(), datos.child("dieta").val() == "true" ? "Sim" : "Não", datos.child("vegetariano").val() == "true" ? "Sim" : "Não", "Não"];
    table.row(filaEditada).data(dataSet).draw();
});
unverifiedUsers.on("child_removed", function (e) {
    table.rows().every(function (rowIdx, tableLoop, rowLoop) {
        var data = this.data();
        if (data[0] == e.key) {
            table.row(rowIdx).remove().draw()
        }
    });
});


$('form').submit(function (e) {
    e.preventDefault();
    let id = $.trim($('#id').val());
    let nif = $.trim($('#nif').val());
    let name = $.trim($('#name').val());
    let num = $.trim($('#num').val());
    let regime = $.trim($('#regime').val());
    let type = $.trim($('#type').val());
    let tickets = $.trim($('#tickets').val());
    let dieta = $.trim($('#dieta').val());
    let vegetariano = $.trim($('#vegetariano').val());
    let email = $.trim($('#email').val());
    console.log("Id: " + id)

    if (id == '') {
        id = Math.floor(Math.random() * 90000000) + 10000000;
    };
    console.log(id);

    data = { nif: nif, name: name, num: num, regime: regime, type: type, tickets: tickets, dieta: dieta, vegetariano: vegetariano };
    actualizacionData = {};
    actualizacionData[`/${id}`] = data;
    if (fila != undefined) {
        if (fila[9] == "Sim") {
            verifiedUsers.update(actualizacionData);
        } else if (fila[9] == "Não") {
            unverifiedUsers.update(actualizacionData);
        }
        logsRef.push().set({
            "event": "adminLogin",
            "msg": "O administrador modificou os dados de um utilizador",
            "timestamp": Date.now(),
            "userName": useremail,
        });
    } else {
        unverifiedUsers.update(actualizacionData);
        sendEmail(name, id, email);
        alert("Código de registo: " + id);
        logsRef.push().set({
            "event": "adminLogin",
            "msg": "O administrador criou um utilizador",
            "timestamp": Date.now(),
            "userName": useremail,
        });
    }
    $("form").trigger("reset");
    $('#modalAltaEdicion').modal('hide');
});

$('#btnNovo').click(function () {
    fila = undefined;
    console.log("Novo");
    $('#id').val('');
    $('#nif').val('');
    $('#name').val('');
    $('#num').val('');
    $('#regime').val('');
    $('#type').val('');
    $('#tickets').val('');
    $('#dieta').value = '';
    $('#vegetariano').value = '';
    $("form").trigger("reset");
    $('#modalAltaEdicion').modal('show');
});

var fila;

$("#tabela").on("click", ".btnEditar", function () {
    filaEditada = table.row($(this).parents('tr'));
    fila = $('#tabela').dataTable().fnGetData($(this).closest('tr'));
    let id = fila[0];
    id = fila[0];
    console.log(id);

    let dieta = $(this).closest('tr').find('td:eq(6)').text();
    let name = $(this).closest('tr').find('td:eq(1)').text();
    let nif = $(this).closest('tr').find('td:eq(0)').text();
    let num = $(this).closest('tr').find('td:eq(2)').text();
    let regime = $(this).closest('tr').find('td:eq(3)').text();
    let tickets = parseInt($(this).closest('tr').find('td:eq(5)').text());
    let type = $(this).closest('tr').find('td:eq(4)').text();
    let vegetariano = $(this).closest('tr').find('td:eq(7)').text();

    $('#id').val(id);
    $('#nif').val(nif);
    $('#name').val(name);
    $('#num').val(num);
    $('#regime').val(regime);
    $('#type').val(type);
    $('#tickets').val(tickets);
    $('#dieta').value = dieta;
    $('#vegetariano').value = vegetariano;
    $('#modalAltaEdicion').modal('show');
    if ($('#type').val() == "Aluno") {
        regimeForm.style.display = "initial";
    }
    emailForm.style.display = "none";
    nForm.setAttribute("disabled", "");
    nForm.removeAttribute("required", "");
    emailInput.setAttribute("disabled", "");
    emailInput.removeAttribute("required");
    nifInput.setAttribute("disabled", "");
    nifInput.removeAttribute("required", "");
    tipoInput.setAttribute("disabled", "");
    tipoInput.removeAttribute("required", "");
    nInput.setAttribute("disabled", "");
    nInput.removeAttribute("required", "");


});

$("#tabela").on("click", ".btnBorrar", function () {
    filaEliminada = $(this);
    Swal.fire({
        title: 'Tem a certeza que quer eliminar este registo?',
        text: "Esta operação é irreversivel!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Apagar'
    }).then((result) => {
        if (result.value) {
            let fila = $('#tabela').dataTable().fnGetData($(this).closest('tr'));
            let id = fila[0];
            console.log(fila[9]);
            if (fila[9] == "Não") {
                db.ref(`server/unverifiedUsers/${id}`).remove()
            } else {
                db.ref(`server/verifiedUsers/${id}`).remove()
                db.ref(`server/bookings/${id}`).remove()
            }
            logsRef.push().set({
                "event": "adminLogin",
                "msg": "O administrador apagou um utilizador",
                "timestamp": Date.now(),
                "userName": useremail,
            });
            Swal.fire('Eliminado!', 'O registo foi removido com sucesso   ', 'success')
        }
    })
});

function sendEmail(name, message, to_email) {
    var templateParams = {
        to_name: name,
        message: message,
        to_email: to_email,
    };

    emailjs.send('service_m0ouae8', 'template_gd6arkj', templateParams)
        .then(function (response) {
            console.log('SUCCESS!', response.status, response.text);
        }, function (error) {
            console.log('FAILED...', error);
        });
}

