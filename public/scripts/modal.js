function showPass() {
    var x = document.getElementById("passwordinput");
    var confirmX = document.getElementById("passwordinput2");
    var y = document.getElementById("hide1");
    var z = document.getElementById("hide2");
    if (x.type === "password") {
        x.type = "text";
        confirmX.type = "text";
        y.style.display = "contents";
        z.style.display = "none";
    } else {
        x.type = "password";
        confirmX.type = "password";
        y.style.display = "none";
        z.style.display = "contents";

    }

}

// Show date js
setInterval(function() {
    const t = new Date();
    const time = t.toLocaleTimeString();
    const tsel = document.getElementById('timenow')

    tsel.innerHTML = `<p>${time}</p>`

}, 1000)

var accmodal = document.getElementById("AccountModal");

// Get the button that opens the modal
var joinbtn = document.getElementById("joinbtn");

// Get the <span> element that closes the modal
var closespan = document.getElementsByClassName("accountclose")[0];

// When the user clicks on the button, open the modal
joinbtn.onclick = function() {
    var log_box = document.getElementById("log_box")
    log_box.innerHTML = ''
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // Typical action to be performed when the document is ready:
            log_box.innerHTML = xhttp.responseText;
        }
    };
    xhttp.open("GET", `cblogin`, true);
    xhttp.send();
    accmodal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
closespan.onclick = function() {
    accmodal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == accmodal) {
        accmodal.style.display = "none";
    }
}

function req_signup() {
    var log_box = document.getElementById("log_box")
    log_box.innerHTML = ''
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // Typical action to be performed when the document is ready:
            $('#log_box').html(xhttp.responseText);
        }
    };
    xhttp.open("GET", `cbsignup`, true);
    xhttp.send();
}

function checkuserstatus() {

    var log_box = document.getElementById("log_box")
    var username = document.getElementById("checkuser").value
    log_box.innerHTML = ''
    var xhr = new XMLHttpRequest();
    xhr.open("POST", '/cbsignup_checkuser', true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            $('#log_box').html(xhr.responseText);

        }
    };
    var data = `{"uname" : "${username}"}`
    xhr.send(data);

}

function loggedme() {

    var log_box = document.getElementById("log_box")
    var username = document.getElementById("logged_user").value
    var password = document.getElementById("passwordinput").value
    log_box.innerHTML = ''
    var xhr = new XMLHttpRequest();
    xhr.open("POST", '/cblogin', true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            // log_box.innerHTML = xhr.responseText;
            $('#log_box').html(xhr.responseText);

        }
    };
    var data = `{"username" : "${username}" , "password" : "${password}"}`
    xhr.send(data);

}

function req_login() {
    var log_box = document.getElementById("log_box")
    log_box.innerHTML = ''
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // Typical action to be performed when the document is ready:
            // log_box.innerHTML = xhttp.responseText;
            $('#log_box').html(xhttp.responseText);

        }
    };
    xhttp.open("GET", `cblogin`, true);
    xhttp.send();
}

function key_check() {
    var pass1 = document.getElementById("passwordinput").value
    var pass2 = document.getElementById("passwordinput2").value
    var p_key = document.getElementById("key_txt")
    var submit = document.getElementById("submit_btn")

    if (pass1 == pass2) {
        p_key.innerHTML = `<p style="color: green"> Password Matched Successfully</p>`
        submit.disabled = false
    } else {
        p_key.innerHTML = `<p style="color: red">Password Don't Match ${pass1.length - pass2.length} / ${pass1.length} characters remaining</p>`
    }

}

function signup() {

    var log_box = document.getElementById("log_box")
    var name = document.getElementById("checkuser").value
    var full_name = document.getElementById("full_name").value
    var email = document.getElementById("emailid").value
    var password = document.getElementById("passwordinput2").value
    log_box.innerHTML = ''
    var xhr = new XMLHttpRequest();
    xhr.open("POST", '/cbsignup', true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            $('#log_box').html(xhr.responseText);
        }
    };
    var data = `{"name" : "${name}" , "full_name" : "${full_name}", "email" : "${email}", "password" : "${password}"}`;
    console.log(data)
    xhr.send(data);

}