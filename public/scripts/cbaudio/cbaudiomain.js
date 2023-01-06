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

function search() {
    var getname = document.getElementById('add_song').value
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // Typical action to be performed when the document is ready:
            document.getElementById("dataupdate").innerHTML = xhttp.responseText;
        }
    };
    xhttp.open("GET", `search?q=${getname.replace(/ /gi , '+')}`, true);
    xhttp.send();
    var ele = document.getElementById('dataupdate')
    ele.scrollIntoView()
    setTimeout(function() {
        getid()
    }, 3000)
    li = []

}

function avail(id) {
    document.getElementById("lyrics_txt").innerHTML = 'searching...'

    glowheart = false
    for (fav = 0; fav < likelist.length; fav++) {
        if (id == likelist[fav]) {
            glowheart = true
        }
    }

    if (glowheart) {
        document.getElementById("like").innerHTML = `<p class="unfav" onclick="add_to_fav('${user_req_id}')" title="Remove from Favourites">
                            <span class="material-icons-outlined material-icons">favorite</span>
                        </p>`

        glowheart = false
    } else {
        document.getElementById('like').innerHTML = `
                        <p title="Add to Favourites" onclick="add_to_fav('${user_req_id}')">
                            <span class="material-icons-outlined material-icons">favorite_border</span>
                        </p>
                        `

    }

    do_id = id

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {

            var Json = xhttp.response;
            const json = JSON.parse(Json)
            const results = json.data[0]
            const download = results.downloadUrl
            const lastquality = download[download.length - 1].link
            $('#songplay > div > div > div.titleaud > div.title > p:nth-child(1)').text(results.name)
            $('#songplay > div > div > div.titleaud > div.title > p:nth-child(2) > span:nth-child(2)').text(results.artist)

            webnotifi(results.name, `Now Playing...`)
                // $(".audbox").css("background-image", `url("${json.song_image}")`)
            var r = document.querySelector(':root');
            z = results.image
            image_url = z[z.length - 1].link
            r.style.setProperty('--image', `url('${image_url}')`)

            $('#audiosrc').attr('src', lastquality)
            document.getElementById('plyr-audio').load()
            if (json.song_has_lyrics == 'true') {
                const t = document.getElementById('L_btn')
                t.innerHTML = `<button style="font-family: Arial, Helvetica, sans-serif; color: rgb(11, 144, 221); background-color: black; border: 2px solid white; border-radius: 2px; padding: 5px; font-family: 'Ubuntu';"
                    onclick="showLyrics('${results.id}')">Show Lyrics</button>`
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
        const data = JSON.parse(atob(step3))
        li.push(data.id);
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

function add_to_fav(userid) {
    localStorage.setItem('cbaudio', 'false')
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            webnotifi('Add to favourites', 'CBaudio Favlist')
            document.getElementById("like").innerHTML = `<p class="unfav" onclick="add_to_fav('${userid}')" title="Remove from Favourites">
                            <span class="material-icons-outlined material-icons">favorite</span>
                        </p>`
            update_likelist()

        } else if (this.readyState == 4 && this.status == 201) {
            webnotifi('Removed from favourites', 'CBaudio Favlist')
            document.getElementById('like').innerHTML = `
                        <p title="Add to Favourites" onclick="add_to_fav('${userid}')">
                            <span class="material-icons-outlined material-icons">favorite_border</span>
                        </p>
                        `
            document.getElementById(do_id).remove()
            avail(li[0])
            update_likelist()

        }

    };
    xhttp.open("GET", `cbaudio/api/fav/${userid}/${do_id}`, true);
    xhttp.send();

}

// requesting fav 
function update_likelist() {
    likelist = []
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            fav_list = JSON.parse(this.responseText);
            for (k = 0; k < fav_list.favlist.length; k++) {
                likelist.push(fav_list.favlist[k])
            }

        }

    };
    xhttp.open("GET", `cbaudio/api/get_fav_list/${token}`, true);
    xhttp.send();

}

setTimeout(function() {
    if (token) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                id = JSON.parse(this.responseText);
                user_req_id = id.userid
                cbaudiocon = id.cbaudiocon
                    // if (!cbaudiocon) {
                    //     update_likelist()
                    // }
            }

        };
        xhttp.open("GET", `token/data/${token}`, true);
        xhttp.send();

    } else {
        console.log('u are not a member')
    }
}, 3000);


function addtoWatchlist() {
    document.getElementById("watchList").style.display = "flex";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            $('#insertplaylist').html(this.responseText)
        }

    };
    xhttp.open("GET", `refresh/user/playlist/${token}`, true);
    xhttp.send();
}

function closeWatchlist() {
    document.getElementById("watchList").style.display = "none";
}

// create playlist...

function createplaylist(putid) {
    const playlist = document.getElementById("playlist_create").value;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            $('#insertplaylist').html(this.responseText)
        }

    };
    xhttp.open("POST", `createplaylist/${playlist}/${putid}/${token}`, true);
    xhttp.send();
}


//save playlist 
function saveplaylist(playname) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            webnotifi(`Added to playlist ${playname}`, "CBAudio API");
        }
        if (this.readyState == 4 && this.status == 201) {
            webnotifi(`this song is already in your playlist`, "CBAudio API");
        }

    };
    xhttp.open("GET", `createplaylist/user/data/${playname}/${do_id}/${token}`, true);
    xhttp.send();
}