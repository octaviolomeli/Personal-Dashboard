document.addEventListener("DOMContentLoaded", () => {
    loadReminders();
})

function refreshReminders(){
    const checkboxes = document.getElementsByClassName("remindersTitle");
    for (var i=0;i<checkboxes.length;i++){
        checkboxes[i].style.backgroundColor = "#FFC0CB";
    }
    fetch('/reminders', {
        method: 'POST',
        body: JSON.stringify({choice: 'refresh'}),
        headers: {'Content-Type': 'application/json'}
    })
    .catch(error => console.error(error))
}

function completeReminder(id){
    document.getElementById(id+"reminder").style.backgroundColor = "#91F5AD";
    fetch('/reminders', {
        method: 'POST',
        body: JSON.stringify({choice: 'complete', id: id}),
        headers: {'Content-Type': 'application/json'}
    })
    .catch(error => console.error(error))
}

function loadReminders(){
    fetch('/reminders', {
        method: 'POST',
        body: JSON.stringify({choice: 'load'}),
        headers: {'Content-Type': 'application/json'}
    })
    .then(response =>response.json())
    .then(results => {
        for (var i=0;i<Object.keys(results).length;i++){
            document.getElementsByClassName("remindersTitle")[i].innerText = results[i].title;
            if (results[i].status == "Incomplete"){
                document.getElementsByClassName("remindersTitle")[i].style.backgroundColor = "#FFC0CB";
            }
            else {
                document.getElementsByClassName("remindersTitle")[i].style.backgroundColor = "#91F5AD";
        }}
    })
    .catch(error => console.error(error))
}