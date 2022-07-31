function userplaylistdelete(getvalue) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById(getvalue).remove()
        }

    };
    xhttp.open("GET", `user/playlist/delete/${token}/${getvalue}`, true);
    xhttp.send();

}

function showuserplaylist(getvalue) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            $('#dataupdate').html(this.responseText)
        }

    };
    xhttp.open("GET", `user/playlist/show/${token}/${getvalue}`, true);
    xhttp.send();

}