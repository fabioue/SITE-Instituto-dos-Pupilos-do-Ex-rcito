const config = {
    apiKey: "AIzaSyCpX5gNXalix2wQAEGYSvOzdrvxBU4bK8M",
    authDomain: "papipe-f7cd8.firebaseapp.com",
    databaseURL: "https://papipe-f7cd8-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "papipe-f7cd8",
    storageBucket: "papipe-f7cd8.appspot.com",
    messagingSenderId: "49279927621",
    appId: "1:49279927621:web:5b0a917691a871754fea2c",
    measurementId: "G-2GW2TWG0MY"
};    
firebase.initializeApp(config);
var db = firebase.database();
try {
    var storage = firebase.storage();
} catch(e) {
    
}