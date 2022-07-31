function cbaudio(id) {
    var xhr = new XMLHttpRequest();
    xhr.open("get", `${id}/cbaudio`, true);
    xhr.onreadystatechange = function() {
        if (this.readyState != 4) return;

        if (this.status == 200) {
            $('#fill_content').html(this.responseText);

        }

    };
    xhr.send();
}

function cbvideo(id) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", `${id}/cbvideo`, true);
    xhr.onreadystatechange = function() {
        if (this.readyState != 4) return;
        if (this.status == 200) {
            $('#fill_content').html(this.responseText);

        }
    };
    xhr.send();
}