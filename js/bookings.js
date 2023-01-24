$(document).ready(function () {
    var db = firebase.database();
    var refBookings = db.ref().child("server/bookings/");
    var refVerifiedUsers = db.ref().child("server/verifiedUsers/");
    let listUsers = [];
    var logsRef = db.ref().child("server/logs/");
    var useremail = sessionStorage.getItem("email");


    var dataSet = [];

    const iconoBorrar = '<svg class="bi bi-trash" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>';

    var minDate, maxDate;

    minDate = new DateTime($('#min'), {
        locale: 'pt',
        format: 'D MMM YYYY',
    });
    maxDate = new DateTime($('#max'), {
        locale: 'pt',
        format: 'D MMM YYYY',
    });


    $.fn.dataTable.ext.search.push(
        function (settings, data, dataIndex) {
            var min = minDate.val();
            var max = maxDate.val();
            var date = moment(data[4], "DD/MM/YYYY").toDate();

            if (
                (min === null && max === null) ||
                (min === null && date <= max) ||
                (min <= date && max === null) ||
                (min <= date && date <= max)
            ) {
                return true;
            }
            return false;
        }
    );

    var table = $('#tabela').DataTable({
        dom:
            "<'row'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>>" +
            "<'row'<'col-sm-12'itrpB>>",
        renderer: 'bootstrap',
        pageLength: 5,
        lengthMenu: [[5, 10, 20, -1], [5, 10, 20, 'Todos']],
        data: dataSet,
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
                targets: 0,
                visible: false,
            },
            {
                targets: 1,
                visible: false,
            },
            {
                targets: -1,
                defaultContent: "<button class='btnBorrar btn btn-danger' data-toggle='tooltip' title='Apagar'>" + iconoBorrar + "</button></div></div>",
                width: "1%"
            }
        ],
        columns: [
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
                        return data[8] === "Sim" ? "Sim" : "Não";
                    }
                    if (data[8] === 'Sim') {
                        return "<i class='fa-solid fa-check'></i>";
                    } else {
                        return "<i class='fa-solid fa-xmark'></i>";
                    }
                },
            },
            null,
        ],
        buttons: [
            {
                extend: 'excel',
                text: "Excel <i class='fa fa-file-excel-o'></i>",
                attr: {
                    id: "btnExcel",
                },
                exportOptions: {
                    columns: [2, 3, 4, 5, 6, 7, 8],
                    orthogonal: 'export',
                }
            },
            {
                text: "Filtro <i class='fa-solid fa-filter'></i>",
                attr: {
                    id: "btnFilter"
                },
                action: function (e, node, config) {
                    $('#filtoDatasModal').modal('show')
                }
            },
            {
                text: "Relatório <i class='fa-solid fa-file-lines'></i>",
                attr: {
                    id: "btnRelatorio"
                },
                action: function (e, node, config) {
                    if(table.data().rows().count() > 0) {
                    var bookings = [];
                    for (var i = 0; i < table.data().rows().count(); i++) {
                        bookings.push(table.data()[i]);
                    }
                    if (minDate.val() != null) {
                        bookings = bookings.filter(function (value, index, arr) {
                            var dateBookingMoment = moment(value[4], "DD/MM/YYYY");
                            var dateBookingMin = dateBookingMoment.toDate();
                            return dateBookingMin > minDate.val();
                        });
                    }
                    if (maxDate.val() != null) {
                        bookings = bookings.filter(function (value, index, arr) {
                            var dateBookingMoment = moment(value[4], "DD/MM/YYYY");
                            var dateBookingMin = dateBookingMoment.toDate();
                            return dateBookingMin < maxDate.val();
                        });
                    }
                    console.log(bookings);
                    sessionStorage.setItem("bookings", JSON.stringify(bookings));
                    console.log(minDate.val())
                    sessionStorage.setItem("dataMin", minDate.val());
                    sessionStorage.setItem("dataMax", maxDate.val());

                    window.location.href = "relatorio.html"
                } else {
                    alert("Não existem refeições para criar um relatório")
                }
                }
            },
        ],
    });

    $('#min, #max').on('change', function () {
        table.draw();
    });


    async function getName(id) {
        let userInfo = [];
        refVerifiedUsers = db.ref().child("server/verifiedUsers/" + id);
        await refVerifiedUsers.once("value", users => {
            userInfo.push(users.child("name").val());
            userInfo.push(users.child("nif").val());
        })
        return userInfo;
    }

    refBookings.on("value", bookingUsers => {
        table.clear().draw();
        for (var userID in bookingUsers.val()) {
            let x = userID;
            listUsers.push(userID);
            refVerifiedUsers = db.ref().child("server/verifiedUsers/" + userID);
            refBookings = db.ref().child("server/bookings/" + userID);
            refBookings.on("child_added", bookingList => {
                let name = "";
                getName(userID).then((value => {
                    name = value[0];
                    nif = value[1];
                    var a = new Date(bookingList.child("data").val())
                    dataSet = [bookingList.key, x, name, nif, a.toLocaleDateString("pt-PT"), bookingList.child("local").val() == "primeira" ? "1ª seccção" : "2ª secção", bookingList.child("tipo").val() == "almoco" ? "Almoço" : "Jantar", bookingList.child("especial").val() == "normal" ? "Normal" : bookingList.child("vegetariano").val() == "Vegetariano" ? "Vegetariano" : "Dieta", bookingList.child("consumida").val() == true  || bookingList.child("consumida").val() == "true" ? "Sim" : "Não"];
                    table.rows.add([dataSet]).draw();
                }))
            });
        }
    });
    refBookings.on("child_removed", function () {
        table.row(filaEliminada.parents('tr')).remove().draw();
        document.location.href = document.location.href;
    });



    $("#tabela").on("click", ".btnBorrar", function () {
        filaEliminada = $(this);
        Swal.fire({
            title: 'Tem a certeza que quer eliminar esta refeição?',
            text: "Esta operação é irreversivel!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Apagar'
        }).then((result) => {
            if (result.value) {
                let fila = $('#tabela').dataTable().fnGetData($(this).closest('tr'));
                let idBooking = fila[0];
                let idUser = fila[1];
                db.ref("server/bookings/" + idUser + "/" + idBooking).remove();
                logsRef.push().set({
                    "event" : "adminLogin",
                    "msg" : "O administrador apagou uma marcação",
                    "timestamp" : Date.now(),
                    "userName": useremail,
                });
                Swal.fire('Eliminado!', 'O Aluno foi removido com sucesso   ', 'success')
            }
        })
    });



});
