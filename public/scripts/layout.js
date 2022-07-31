const token = localStorage.getItem('token')

if (token) {
    const username = localStorage.getItem('username');
    document.getElementById("do_btn").innerHTML = `<a href="javascript:void(0)">${username}</a>`
    var xhr = new XMLHttpRequest();
    xhr.open("POST", '/verifytoken', true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() {
        if (this.readyState != 4) return;

        if (this.status == 200) {
            $('#fill_content').html(this.responseText);
        }

    };
    var data = `{"token" : "${token}"}`
    xhr.send(data);
    make = false
} else {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", '/cbwelcome', true);
    xhr.onreadystatechange = function() {
        if (this.readyState != 4) return;

        if (this.status == 200) {
            $('#fill_content').html(this.responseText);
        }

    };
    xhr.send();
}

function logout() {
    localStorage.clear();
    window.location.href = '/'
}

function showfavourites() {
    closeHome()
    var xhr = new XMLHttpRequest();
    xhr.open("GET", `cbaudio/user/favourite/${user_req_id}`, true);
    xhr.onreadystatechange = function() {
        if (this.status == 200) {
            $('#fill_content').html(this.responseText);
        }

    };
    xhr.send();

}

function userplaylists() {
    closeHome()
    var xhr = new XMLHttpRequest();
    xhr.open("GET", `cbaudio/user/playlists/${user_req_id}`, true);
    xhr.onreadystatechange = function() {
        if (this.status == 200) {
            $('#fill_content').html(this.responseText);
        }

    };
    xhr.send();

}


// window.onbeforeunload = function() {
//     localStorage.setItem('token', temp_token)
// }