var refLogs = db.ref().child("server/logs/");
refLogs.on("child_added", log => {
    let list = document.getElementById("myList");

    let timestamp = log.child("timestamp").val();
    console.log(timestamp);
    var date = new Date(timestamp);
    let name = log.child("userName").val();
    var li = document.createElement("li");
    var time = document.createElement("strong");
    var userName = document.createElement("strong");
    var event = document.createElement("div");
    var description = document.createElement("small");
    userName.innerHTML = name;
    time.innerHTML = "[" + date.toLocaleString() + "] ";
    event.innerHTML = log.child("event").val();
    userName.className = "name";
    time.className = "datetime";
    event.classList ="event";
    event.style.display = "none";
    description.innerHTML = " -> " + log.child("msg").val();
    description.className = "description";
    li.appendChild(time);
    li.appendChild(userName);
    li.appendChild(event);
    li.appendChild(description);
    document.getElementById("list").appendChild(li);
});



var input = document.getElementById('input');
input.onkeyup = function () {
    var filter = input.value.toUpperCase();
    var lis = document.getElementsByTagName('li');
    for (var i = 0; i < lis.length; i++) {
        var name = lis[i].getElementsByClassName('name')[0].innerHTML;
        var event = lis[i].getElementsByClassName('event')[0].innerHTML;
        var datetime = lis[i].getElementsByClassName('datetime')[0].innerHTML;
        datetime = datetime.replace("[", "");
        datetime = datetime.replace("]", "");
        if (name.toUpperCase().indexOf(filter) == 0 || event.toUpperCase().indexOf(filter) == 0 || datetime.toUpperCase().indexOf(filter) == 0) 
            lis[i].style.display = 'list-item';
        else
            lis[i].style.display = 'none';
    }
}