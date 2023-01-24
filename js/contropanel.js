var e = document.getElementById("diasParaMarcar");
var checkboxAlmoco = document.getElementById("checkAlmoco");
var checkboxJantar = document.getElementById("checkJantar");
var diaDaSemana = e.value;
var def = new Object();
def["almoco"] = true;
def["jantar"] = true;
var ref = db.ref().child("server/rules/");
var refDias = db.ref().child("server/rules/diasParaMarcar");

ref.child("tempoAntecedenciaMarcar").on("value", dados => {
    document.getElementById("marcarLabel").innerHTML += " (Atual: " + dados.val() + ")"
});

ref.child("tempoAntecedenciaDesmarcar").on("value", dados => {
    document.getElementById("desmarcarLabel").innerHTML += " (Atual: " + dados.val() + ")"
});

ref.child("quemPodeMarcar").on("value", dados => {
    document.getElementById("interno").checked = dados.val()["interno"];
    document.getElementById("externo").checked = dados.val()["externo"];
    document.getElementById("professor").checked = dados.val()["professor"];
    document.getElementById("militar").checked = dados.val()["militar"];
    document.getElementById("funcionario").checked = dados.val()["funcionario"];
})


const semanaRefeicoes = new Map([
    ["segunda", def],
    ["terca", def],
    ["quarta", def],
    ["quinta", def],
    ["sexta", def],
]);



refDias.child("segunda").on("value", dados => {
    var def = new Object();
    def["almoco"] = dados.child("almoco").val();
    def["jantar"] = dados.child("jantar").val();
    semanaRefeicoes.set("segunda", def);
})
refDias.child("terca").on("value", dados => {
    var def = new Object();
    def["almoco"] = dados.child("almoco").val();
    def["jantar"] = dados.child("jantar").val();
    semanaRefeicoes.set("terca", def);
})
refDias.child("quarta").on("value", dados => {
    var def = new Object();
    def["almoco"] = dados.child("almoco").val();
    def["jantar"] = dados.child("jantar").val();
    semanaRefeicoes.set("quarta", def);
})
refDias.child("quinta").on("value", dados => {
    var def = new Object();
    def["almoco"] = dados.child("almoco").val();
    def["jantar"] = dados.child("jantar").val();
    semanaRefeicoes.set("quinta", def);
})
refDias.child("sexta").on("value", dados => {
    var def = new Object();
    def["almoco"] = dados.child("almoco").val();
    def["jantar"] = dados.child("jantar").val();
    semanaRefeicoes.set("sexta", def);
})


console.log(semanaRefeicoes);


var e1 = document.getElementById("checkAlmoco");
var e2 = document.getElementById("checkJantar");

e.addEventListener("change", function () {
    document.getElementById("almocojantarCheckBox").style.display = "initial";
    var value = semanaRefeicoes.get(e.value)
    console.log(semanaRefeicoes.get(e.value));
    e1.checked = value["almoco"]
    e2.checked = value["jantar"]
});

e1.addEventListener("change", function () {
    var def = new Object();
    def["almoco"] = e1.checked;
    def["jantar"] = semanaRefeicoes.get(e.value)["jantar"];
    semanaRefeicoes.set(e.value, def)
});
e2.addEventListener("change", function () {
    var def = new Object();
    def["almoco"] = semanaRefeicoes.get(e.value)["jantar"];
    def["jantar"] = e2.checked;
    semanaRefeicoes.set(e.value, def)
});
var ref = db.ref().child("server/rules/");




document.getElementById("btnConfirmar").addEventListener("click", function () {
    if (document.getElementById("antecendenciaMarcar").value != "") {
        ref.update({
            "tempoAntecedenciaMarcar": document.getElementById("antecendenciaMarcar").value
        })
    }
    if (document.getElementById("antecendenciaDesmarcar").value) {
        ref.update({
            "tempoAntecedenciaDesmarcar": document.getElementById("antecendenciaDesmarcar").value,
        })
    }
    semanaRefeicoes.forEach((value, key) => {
        console.log(key, value);
        ref.child("diasParaMarcar").child(key).update({
            "almoco": value["almoco"],
            "jantar": value["jantar"],
        })
    });
    ref.child("quemPodeMarcar").update({
        "interno": document.getElementById("interno").checked,
        "externo": document.getElementById("externo").checked,
        "militar": document.getElementById("militar").checked,
        "professor": document.getElementById("professor").checked,
        "funcionario": document.getElementById("funcionario").checked,
    })
});
