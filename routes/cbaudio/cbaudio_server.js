const app = require('express').Router()
const axios = require('axios')
const User = require('../../config/models/User')
const CBaudio_db = require('../../config/models/CBaudio_db')
const { v4: uuid4 } = require('uuid')
require('dotenv').config()
const jwt = require('jsonwebtoken')
const { base64encode, base64decode } = require('nodejs-base64');
const { countDocuments } = require('../../config/models/User')
const cheerio = require('cheerio')

var jsontokenkey = "dirty_cb_manager"


app.get("/lyrics", (req, res) => {
    var id = req.query.id
    async function cs() {
        const data = await axios({
            method: 'get',
            url: `https://saavn.me/lyrics?id=${id}`
        })
        const json = data.data
        res.send(json.lyrics)
    }
    cs()


});

app.get("/search", (req, res) => {
    var songname = req.query.q
    async function run() {
        try {
            const data = await axios({
                method: 'get',
                url: `https://www.jiosaavn.com/api.php?__call=search.getResults&_format=json&n=20&p=1&_marker=0&ctx=android&q=${songname}`
            })
            const json = data.data.results
            for (k = 0; k < json.length; k++) {
                t = json[k].duration

                const min_time = Math.floor(t / 60)
                const sec_time = (t % 60)
                const song_duration = (min_time + ":" + sec_time)

                let songid = json[k].perma_url.split("/")
                const w = `${songid[songid.length-2]}/${songid[songid.length - 1]}`

                const x_data_me = {
                    id: json[k].id,
                    perma: w
                }

                res.write(`<div class="audioitem" onclick="avail('${base64encode(JSON.stringify(x_data_me))}')">
                <div class="audiofile">
                    <div class="audioicon">
                        <img src="${json[k].image}" width="100%" height="100%" alt="">
                        
                        <span class="material-icons material-icons-outlined">
                            play_arrow
                        </span>
                    </div>
                    <div class="audname">
                        ${json[k].song}
                    </div>
                </div>
                <div class="filedate">
                    ${json[k].singers}
                </div>
                <div class="filedate">
                    ${json[k].album} | ${json[k].language}
                </div>
                <div class="audduration">
                    ${song_duration} min
                </div>
            </div>`)
            }
            res.send()
        } catch (err) {
            res.status(500).send()
        }

    }
    run()


});

app.get('/playsong', (req, res) => {
    const r = JSON.parse(base64decode(req.query.id))
    var songid = r.perma
        // const w = `${songid[songid.length-2]}/${songid[songid.length - 1]}`
    async function ty() {
        try {
            const data = await axios({
                method: 'GET',
                url: `https://saavn.me/songs?link=https://www.jiosaavn.com/song/${songid}`
            })
            const json = JSON.stringify(data.data)
            res.send(json)


        } catch (err) {
            res.status(500).send()
        }
    }
    ty()

})

function arrayRemove(arr, value) {
    return arr.filter(function(ele) {
        return ele != value;
    });
}



// adding favsong endpoint..
app.get('/cbaudio/api/fav/:userid/:do_id', (req, res) => {
    const userid = req.params.userid
    r = JSON.parse(base64decode(req.params.do_id))
    const do_id = r.id
    User.findOne({ _id: userid }, async(err, results) => {
        if (results) {
            if (results.set_of_conditions.cbaudio) {
                const CB = new CBaudio_db({
                    userid: userid,
                    username: results.username,
                    fullname: results.fullname,
                    uuid: uuid4(),
                    fav_song: do_id

                })
                await CB.save()
                const newjson = results.set_of_conditions
                newjson["cbaudio"] = false
                var con = { $set: { set_of_conditions: newjson } }
                User.updateOne({ _id: userid }, con, (err, results) => {
                    if (err) {
                        res.send("500 internal server error !")
                    }

                })
            } else {
                CBaudio_db.findOne({ userid: userid }, async(err, listdb) => {

                    const up = listdb.fav_song
                    do_con = false
                    for (i = 0; i < up.length; i++) {
                        if (do_id == up[i]) {
                            do_con = true
                        }

                    }
                    if (do_con) {
                        const newlist = arrayRemove(up, `${do_id}`);
                        const newvalue1 = { $set: { fav_song: newlist } }
                        CBaudio_db.updateOne({ userid: userid }, newvalue1, (err, results) => {
                            if (err) {
                                res.send("500 internal server error !")
                            }

                        })
                        res.status(201).send()
                    } else {
                        up.push(do_id)
                        var newvalue = { $set: { fav_song: up } }
                        CBaudio_db.updateOne({ userid: userid }, newvalue, (err, results) => {
                            if (err) {
                                res.send("500 internal server error !")
                            }

                        })
                        res.status(200).send()
                    }

                }).clone().catch(err => {
                    console.log(err)
                })

            }


        }

    }).clone().catch(err => {
        console.log(err)
    })


})

app.get('/token/data/:token', async(req, res) => {
    const token = req.params.token
    const verify = await jwt.verify(token, jsontokenkey)

    const data = {
        username: verify.username,
        userid: verify.user_id,
    }
    User.findOne({ _id: data.userid }, (err, result) => {
        res.send({ userid: data.userid, cbaudiocon: result.cbaudio })
    }).clone()

})

//requesting list fav song
app.get('/cbaudio/api/get_fav_list/:token', async(req, res) => {
    const token = req.params.token
    const verify = await jwt.verify(token, jsontokenkey)

    const data = {
        username: verify.username,
        userid: verify.user_id,
    }

    CBaudio_db.findOne({ userid: data.userid }, (err, results) => {
        res.send({ favlist: results.fav_song })
    }).clone().catch(err => {
        console.log(err)
    })


})

// cbaudio favourite ,.....

app.get('/:userid/show/favourite', async(req, res) => {
    const userid = req.params.userid
    await CBaudio_db.findOne({ userid: userid }, async(err, results) => {
        favdata = results.fav_song
        if (typeof(favdata[0]) == 'undefined') {
            res.status(201).send()
        } else {
            const y = []
            for (s = favdata.length; s--;) {
                const data = await axios({
                        method: 'get',
                        url: `https://www.jiosaavn.com/api.php?__call=song.getDetails&cc=in&_marker=0%3F_marker%3D0&_format=json&pids=${favdata[s]}`
                    })
                    // const $ = cheerio.load(data.data)
                    // f = JSON.parse($('p').text())
                y.push(data.data)
            }
            for (v = 0; v < y.length; v++) {

                song_data = y[v][Object.keys(y[v])]
                tu = song_data.duration

                const min_time = Math.floor(tu / 60)
                const sec_time = (tu % 60)
                const song_duration = (min_time + ":" + sec_time)
                res.write(`<div class="audioitem" id="${song_data.id}" onclick="avail('${song_data.id}')">
                    <div class="audiofile">
                        <div class="audioicon">
                            <img src="${song_data.image}" width="100%" height="100%" alt="">

                        <span class="material-icons material-icons-outlined">
                            play_arrow
                        </span>
                    </div>
                    <div class="audname">
                        ${song_data.song}
                    </div>
                </div>
                <div class="filedate">
                    ${song_data.singers}
                </div>
                <div class="filedate">
                    ${song_data.album} | ${song_data.language}
                </div>
                <div class="audduration">
                    ${song_duration} min
                </div>
            </div>`)
            }
            res.end()

        }

    }).clone().catch(err => {
        res.send("nothing to show here")
        console.log(err)
    })

})

app.get('/cbaudio/user/favourite/:userid', async(req, res) => {
    const userid = req.params.userid
    await CBaudio_db.findOne({ userid: userid }, (err, results) => {
        if (results) {
            const data = {
                userid: userid,
                username: base64encode(results.username),
                en_userid: base64encode(userid),
            }
            res.render('cbaudiofavouritesong.ejs', { data: data })
        } else {
            res.send('<h1>Nothing to show here add some song to your favourite list and visit again</h1>')
        }
    }).clone().catch(err => {
        console.log(err)
    })
})

// create playlists 
app.post('/createplaylist/:playlistname/:userid/:token', async(req, res) => {
    const playlistname = req.params.playlistname
    const userid = req.params.userid
    const token = req.params.token
    const verify = await jwt.verify(token, jsontokenkey)
    if (userid == verify.user_id) {
        User.findOne({ _id: userid }, async(err, results) => {
            if (results) {
                if (results.set_of_conditions.playlist) {
                    const CB = new CBaudio_db({
                        userid: userid,
                        username: results.username,
                        fullname: results.fullname,
                        uuid: uuid4(),
                        playlistname: playlistname,
                        user_playlist_data: []

                    })
                    await CB.save()
                    results.set_of_conditions["playlist"] = false
                    var con = { $set: { set_of_conditions: results.set_of_conditions } }
                    User.updateOne({ _id: userid }, con, (err, results) => {
                        if (err) {
                            res.send("500 internal server error !")
                        }
                        res.write(`<div onclick="saveplaylist('${playlistname}')" style="cursor: cell;"><span class="material-icons-outlined material-icons">add_circle_outline</span>${playlistname}}</div><hr><br>`);

                        res.end()

                    }).clone()
                } else {
                    CBaudio_db.findOne({ userid: userid }, async(err, listdb) => {

                        const up1 = listdb.playlistname
                        do_con1 = false
                        for (i = 0; i < up1.length; i++) {
                            if (playlistname == up1[i]) {
                                do_con1 = true
                            }

                        }
                        if (do_con1) {
                            res.send("samefile found")
                        } else {
                            up1.push(playlistname)
                            var newvalue = { $set: { playlistname: up1 } }
                            CBaudio_db.updateOne({ userid: userid }, newvalue, (err, results) => {
                                if (err) {
                                    res.send("500 internal server error !")
                                }

                            }).clone()
                            for (fg = 0; fg < up1.length; fg++) {
                                res.write(`<div onclick="saveplaylist('${up1[fg]}')" style="cursor: cell;"><span class="material-icons-outlined material-icons">add_circle_outline</span>${up1[fg]}</div><hr><br>`);


                            }
                            res.end()
                        }

                    }).clone()

                }
            }

        }).clone().catch(error => {
            console.log(error)
        })
    }

})

//refresh playlist
app.get('/refresh/user/playlist/:token', async(req, res) => {
    const token = req.params.token
    const verify = await jwt.verify(token, jsontokenkey)
    User.findOne({ _id: verify.user_id }, (err, results) => {
        if (!results.set_of_conditions.playlist) {
            CBaudio_db.findOne({ userid: verify.user_id }, (err, results) => {
                const up1 = results.playlistname
                for (fg = 0; fg < up1.length; fg++) {
                    res.write(`<div onclick="saveplaylist('${up1[fg]}')" style="cursor: cell;"><span class="material-icons-outlined material-icons">add_circle_outline</span>${up1[fg]}</div><hr><br>`);

                }
                res.end()
            }).clone().catch(error => {
                console.log(err)
            })
        } else { res.status(204).send() }
    })

})

// converting stringarray to array
function stringarray(parameter) {
    if (typeof(parameter) === 'string') {
        let s = parameter.substring(1)
        let q = s.slice(0, -1)
        let g = q.split(',')

        let x = []

        for (v = 0; v < g.length; v++) {
            x.push(g[v])
        }
        return x
    } else {
        return parameter
    }


}


// add song to playlist
app.get('/createplaylist/user/data/:playname/:do_id/:token', async(req, res) => {
    const play_list_name = req.params.playname
    const r = JSON.parse(base64decode(req.params.do_id))
    const do_id = r.id
    const token = req.params.token
    const verify = await jwt.verify(token, jsontokenkey)
    if (verify) {
        CBaudio_db.findOne({ userid: verify.user_id }, (err, results) => {
            if (results) {
                const arr = results.user_playlist_data
                found = false
                try {

                    for (u = 0; u < arr.length; u++) {
                        if (Object.keys(arr[u]) == play_list_name) {
                            jsonindex = u
                            found = true
                        }
                    }

                } catch (err) {
                    console.log(err)
                }

                if (found) {
                    const string_arr = arr[jsonindex][play_list_name]
                    const to_update_arr = stringarray(string_arr)
                    song_dup = false
                    for (z = 0; z < to_update_arr.length; z++) {
                        if (to_update_arr[z] == do_id) {
                            song_dup = true
                        }
                    }
                    if (song_dup) {
                        res.status(201).send()
                    } else {
                        to_update_arr.push(do_id)

                        arr[jsonindex][play_list_name] = to_update_arr

                        const updated_arr = arr[jsonindex]

                        arr.splice(jsonindex)
                        arr.push(updated_arr)
                        const newvalue = { $set: { user_playlist_data: arr } }
                        CBaudio_db.updateOne({ userid: verify.user_id }, newvalue, (err, results) => {
                            if (err) {
                                res.send("500 internal server error !")
                            }

                        }).clone()

                        res.send(results.user_playlist_data)
                        found = false
                    }

                } else {
                    const add_json = `{
                        "${play_list_name}" : "[${do_id}]"
                    }`
                    arr.push(JSON.parse(add_json))

                    const newvalue = { $set: { user_playlist_data: arr } }
                    CBaudio_db.updateOne({ userid: verify.user_id }, newvalue, (err, results) => {
                        if (err) {
                            res.send("500 internal server error !")
                        }

                    }).clone()
                    res.send(results.user_playlist_data);
                }
            }

        }).clone()
    }
})

// cbaudiouserplaylist.ejs data update

app.get('/cbaudio/user/playlists/:userid', async(req, res) => {
    const userid = req.params.userid
    try {
        CBaudio_db.findOne({ userid: userid }, (err, results) => {
            if (results) {
                userplaylist = results.playlistname
                playlist_enc = []
                for (s = 0; s < userplaylist.length; s++) {
                    playlist_enc.push(base64encode(userplaylist[s]))
                }
                res.render('cbaudiouserplalist.ejs', { data: userplaylist, data_enc: playlist_enc })
            }
        }).clone(err => {
            console.log(err)
        })
    } catch (err) {
        console.log(err)
        res.send("<h1>You have no playlist...</h1>")
    }

})

//user playlist delete
app.get('/user/playlist/delete/:token/:getvalue', async(req, res) => {
    const token = req.params.token
    const getvalue = base64decode(req.params.getvalue)
    const verify = await jwt.verify(token, jsontokenkey)
    CBaudio_db.findOne({ userid: verify.user_id }, (err, result) => {
        playlist_array = result.playlistname
        df = false
        for (c = 0; c < playlist_array.length; c++) {
            if (playlist_array[c] == getvalue) {
                df = true
                df_index = playlist_array[c]
            }
        }
        if (df) {
            const newvalue = { $set: { playlistname: arrayRemove(playlist_array, df_index) } }
            CBaudio_db.updateOne({ userid: verify.user_id }, newvalue, (err, results) => {
                if (err) {
                    res.send("500 internal server error !")
                }

            }).clone()
            CBaudio_db.findOne({ userid: verify.user_id }, (err, results) => {
                const show_array = results.playlistname
                for (y = 0; y < show_array.length; y++) {
                    res.write(`<div class="playlist_item">
            <p onclick="showuserplaylist('${show_array[y]}')">
            ${show_array[y]}
            </p>

            <div class="deletebutton">
                <span onclick="userplaylistdelete('${show_array[y]}')" class="material-icons material-icons-outlined deletebtn">
                    delete
                </span>
            </div>
        </div>`)

                }
                res.end()

            }).clone()

        }
    }).clone()
})

// show user playlist
app.get('/user/playlist/show/:token/:getvalue', async(req, res) => {
    const token = req.params.token
    const getvalue = base64decode(req.params.getvalue)
    const verify = await jwt.verify(token, jsontokenkey)
    CBaudio_db.findOne({ userid: verify.user_id }, async(err, result) => {
        playlist_array = result.user_playlist_data
        proceed_next = false
        for (d = 0; d < playlist_array.length; d++) {
            w = Object.keys(playlist_array[d])
            if (w == getvalue) {
                proceed_next = true
                selected_array = playlist_array[d]
            }
        }
        if (proceed_next) {
            ul = stringarray(selected_array[getvalue])
            const y = []
            for (s = ul.length; s--;) {
                const data = await axios({
                    method: 'get',
                    url: `https://www.jiosaavn.com/api.php?__call=song.getDetails&cc=in&_marker=0%3F_marker%3D0&_format=json&pids=${ul[s]}`
                })
                y.push(data.data)
            }
            for (v = 0; v < y.length; v++) {
                console.log(y[v])

                song_data = y[v][Object.keys(y[v])]
                tu = song_data.duration

                const min_time = Math.floor(tu / 60)
                const sec_time = (tu % 60)
                const song_duration = (min_time + ":" + sec_time)
                res.write(`<div class="audioitem" id="${song_data.id}" onclick="avail('${song_data.id}')">
                    <div class="audiofile">
                        <div class="audioicon">
                            <img src="${song_data.image}" width="100%" height="100%" alt="">

                        <span class="material-icons material-icons-outlined">
                            play_arrow
                        </span>
                    </div>
                    <div class="audname">
                        ${song_data.song}
                    </div>
                </div>
                <div class="filedate">
                    ${song_data.singers}
                </div>
                <div class="filedate">
                    ${song_data.album} | ${song_data.language}
                </div>
                <div class="audduration">
                    ${song_duration} min
                </div>
            </div>`)
            }
            res.end()
        } else {
            res.send('nothing to show here')
        }



    }).clone()
})

app.get('/good/:userid', async(req, res) => {
    const userid = req.params.userid
    CBaudio_db.findOne({ userid: userid }, (err, results) => {
        res.send(results);
        console.log(results)
    }).clone()
})
module.exports = app