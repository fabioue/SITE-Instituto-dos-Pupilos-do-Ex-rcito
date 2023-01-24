var db = firebase.database();
var accounts = db.ref().child("server/accounts");

var useremail = sessionStorage.getItem("email");


var dataSet = [];
var filaEliminada;


const iconoEditar = '<svg class="bi bi-pencil-square" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/></svg>';
const iconoBorrar = '<svg class="bi bi-trash" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>';
var logsRef = db.ref().child("server/logs/");

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
                columns: [1, 2],
                orthogonal: 'export',
            },
        },
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

accounts.on("child_added", datos => {
    dataSet = [datos.key, datos.child("email").val(), datos.child("role").val() == "admin" ? "Admin" : "Super Admin"];
    table.rows.add([dataSet]).draw();
});
accounts.on('child_changed', datos => {
    dataSet = [datos.key, datos.child("email").val(), datos.child("role").val() == "admin" ? "Admin" : "Super Admin"];
    table.row(filaEditada).data(dataSet).draw();
});
accounts.on("child_removed", function () {
    table.row(filaEliminada.parents('tr')).remove().draw();
});

$('#btnNovo').click(function () {
    editar = false;
    console.log("Novo");
    $('#email').val();
    $('#senha').val();
    $('#type').val();
    $("form").trigger("reset");
    document.getElementById("passwordForm").style.display = "initial";
    document.getElementById("email").removeAttribute("disabled");
    document.getElementById("email").setAttribute("required", "");
    $('#modalAltaEdicion').modal('show');
});

var editar = false;

$("#tabela").on("click", ".btnEditar", function () {
    editar = true;
    filaEditada = table.row($(this).parents('tr'));
    fila = $('#tabela').dataTable().fnGetData($(this).closest('tr'));
    let id = fila[0];
    let password = $(this).closest('tr').find('td:eq(1)').text();
    let email = $(this).closest('tr').find('td:eq(0)').text();
    let type = $(this).closest('tr').find('td:eq(2)').text();
    console.log(type);
    $('#id').val(id);
    $('#email').val(email);
    $('#password').val(password);
    $('#type').value = type;
    console.log(id, email, type)
    document.getElementById("passwordForm").style.display = "none";
    document.getElementById("email").setAttribute("disabled", "");
    document.getElementById("email").removeAttribute("required");
    document.getElementById("senha").removeAttribute("required");

    $('#modalAltaEdicion').modal('show');
});

$('form').submit(function (e) {
    e.preventDefault();
    let id = $.trim($('#id').val())
    let senha = $.trim($('#senha').val())
    let email = $.trim($('#email').val());
    let type = $.trim($('#type').val());

    console.log(senha);

    data = { email: email, role: type };
    actualizacionData = {};
    actualizacionData = data;
    if (editar) {
        var accountUser = db.ref().child("server/accounts/" + fila[0]);
        accountUser.update(actualizacionData);
        logsRef.push().set({
            "event" : "adminLogin",
            "msg" : "O administrador modificou uma conta administrativa",
            "timestamp" : Date.now(),
            "userName": email,
        });
    } else {
        accounts.push().set(actualizacionData);
        firebase.auth().createUserWithEmailAndPassword(email, senha)
            .then((userCredential) => {
                console.log("conta criada")
                logsRef.push().set({
                    "event" : "adminLogin",
                    "msg" : "O administrador criou uma conta administrativa",
                    "timestamp" : Date.now(),
                    "userName": email,
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }
    id = '';
    $("form").trigger("reset");
    $('#modalAltaEdicion').modal('hide');
});

$("#tabela").on("click", ".btnBorrar", function () {
    filaEliminada = $(this);
    let fila = $('#tabela').dataTable().fnGetData($(this).closest('tr'));
    if (fila[1] != useremail) {
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
                let id = fila[0];
                db.ref(`server/accounts/${id}`).remove()
                logsRef.push().set({
                    "event" : "adminLogin",
                    "msg" : "O administrador apagou uma conta administrativa",
                    "timestamp" : Date.now(),
                    "userName": email,
                });
                Swal.fire('Eliminado!', 'O registo foi removido com sucesso   ', 'success');

            }
        })
    } else {
        alert("Não podes apagar a tua própria conta.")
    }

});