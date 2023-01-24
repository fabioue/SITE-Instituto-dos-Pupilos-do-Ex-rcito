var logsRef = db.ref().child("server/logs/");
var useremail = sessionStorage.getItem("email");


function uploadImage() {
    const ref = firebase.storage().ref();
    const file = document.querySelector("#photo").files[0];
    const name = "ementa";
    const metadata = {
        contentType: file.type
    };
    const task = ref.child(name).put(file, metadata);
    task
        .then(snapshot => snapshot.ref.getDownloadURL())
        .then(url => {
            document.querySelector("#image").src = url;
            alert("Upload feito com sucesso!")
            logsRef.push().set({
                "event" : "adminLogin",
                "msg" : "O administrador modificou a ementa",
                "timestamp" : Date.now(),
                "userName": useremail,
            });
        })
        .catch(console.error);
}
