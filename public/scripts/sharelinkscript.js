//global decalaration..
li = []
likelist = []
do_id = ''
var user_req_id;

function audion() {
    document.getElementById("livecd").style.animation = "rotatecd 3s ease-in-out infinite";
}

function audioff() {
    document.getElementById("livecd").style.animation = "wrong---";
    musicinit()
}

window.onscroll = function() { myFunction() };

function myFunction() {
    if (document.body.scrollTop > 10 || document.documentElement.scrollTop > 10) {
        document.getElementById("objectdown").classList.add("stickybottom");
    } else {
        document.getElementById("objectdown").classList.remove("stickybottom");
    }
}

function showLyrics(id) {
    const lyricsbox = document.getElementById('lyricsbox');
    lyricsbox.classList.remove('hidden')
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // Typical action to be performed when the document is ready:
            document.getElementById("lyrics_txt").innerHTML = xhttp.responseText;
        }
    };
    xhttp.open("GET", `lyrics?id=${id}`, true);
    xhttp.send();


}

function hideLyrics() {
    const lyricsbox = document.getElementById('lyricsbox');
    lyricsbox.classList.add('hidden')
    document.getElementById("lyrics_txt").innerHTML = 'searching...'
}
setTimeout(() => {
    getid()
}, 3000);

function avail(id) {
    document.getElementById("lyrics_txt").innerHTML = 'searching...'
    do_id = id

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {

            var Json = xhttp.response;
            const json = JSON.parse(Json)
            const download = json.download_links
            const lastquality = download[download.length - 1]
            $('#songplay > div > div > div.titleaud > div.title > p:nth-child(1)').text(json.song_name)
            $('#songplay > div > div > div.titleaud > div.title > p:nth-child(2) > span:nth-child(2)').text(json.song_artist)

            webnotifi(json.song_name, `Now Playing...`)

            var r = document.querySelector(':root');
            r.style.setProperty('--image', `url('${json.song_image}')`)

            $('#audiosrc').attr('src', lastquality)
            document.getElementById('plyr-audio').load()
            if (json.song_has_lyrics == 'true') {
                const t = document.getElementById('L_btn')
                t.innerHTML = `<button style="font-family: Arial, Helvetica, sans-serif; color: rgb(11, 144, 221); background-color: black; border: 2px solid white; border-radius: 2px; padding: 5px; font-family: 'Ubuntu';"
                    onclick="showLyrics('${json.song_id}')">Show Lyrics</button>`
            } else {
                const t = document.getElementById('L_btn')
                t.innerHTML = ''
            }
        }
    };
    xhttp.open("GET", `playsong?id=${id}`, true);
    xhttp.send();
}



function getid() {
    $('#dataupdate > div').each((index, element) => {
        var step1 = $(element).attr('onclick').replace(/avail/gi, '')
        var step2 = step1.replace("('", '')
        var step3 = step2.replace("')", '')
        li.push(step3);
    })
}


onemake = false

function updateTrackTime(track) {

    var currTime = Math.floor(track.currentTime).toString();
    var duration = Math.floor(track.duration).toString();

    if (currTime === duration) {
        onemake = true;
    }

}

function musicinit() {
    if (onemake) {
        play_id = ''
        for (q = 0; q < li.length; q++) {
            if (li[q] == do_id) {
                if (li.length < li.length + 1) {

                    play_id = li[q + 1]

                }
            }

        }
        onemake = false;
        do_id = ''
        avail(play_id)
    }
}

const token = localStorage.getItem('username')
if (token) {
    console.log('hi')
}