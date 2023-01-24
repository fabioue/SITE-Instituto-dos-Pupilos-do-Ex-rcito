document.getElementById("loginForm").addEventListener("submit", (event) => {
    event.preventDefault()
})

var logsRef = db.ref().child("server/logs/");


firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE)

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        var ref = db.ref().child("server/accounts/");
        ref.on("value", dados => {
            for (var account in dados.val()) {
                if (dados.child(account).child("email").val() == user.email) {
                    sessionStorage.setItem("role", dados.child(account).child("role").val());
                    sessionStorage.setItem("email", user.email);
                    location.replace("users.html")
                }
            }
        });

    }
})

function login() {
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    firebase.auth().signInWithEmailAndPassword(email, password)
        .catch((error) => {
            document.getElementById("error").innerHTML = error.message
        });
    logsRef.push().set({
        "event" : "adminLogin",
        "msg" : "O administrador entrou na conta",
        "timestamp" : Date.now(),
        "userName": email,
    });
}

function signUp() {
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .catch((error) => {
            document.getElementById("error").innerHTML = error.message
        });
}

function forgotPass() {
    const email = document.getElementById("email").value
    firebase.auth().sendPasswordResetEmail(email)
        .then(() => {
            alert("Verifique o seu email para mudar a password")
        })
        .catch((error) => {
            document.getElementById("error").innerHTML = "Tem de preencher o campo email"
        });
}

let btn = document.querySelector('.lnr-eye');
btn.addEventListener('click', function () {
    let input = document.querySelector('#password');
    if (input.getAttribute('type') == 'password') {
        input.setAttribute('type', 'text');
    } else {
        input.setAttribute('type', 'password');
    }
});