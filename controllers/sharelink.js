const app = require('express').Router()
const axios = require('axios')
const User = require('../config/models/User')
const CBaudio_db = require('../config/models/CBaudio_db')
const { v4: uuid4 } = require('uuid')
require('dotenv').config()
const jwt = require('jsonwebtoken')
const { base64encode, base64decode } = require('nodejs-base64');

app.get('/share', (req, res) => {
    data = {
        name: base64decode(req.query.username),
        de_userid: req.query.token
    }
    res.render('sharelink.ejs', { data: data })
})

app.get('/public/favourite/:userid', (req, res) => {
    const userid = base64decode(req.params.userid)
    CBaudio_db.findOne({ userid: userid }, async(err, results) => {
        favdata = results.fav_song
        const y = []
        for (s = favdata.length; s--;) {
            const data = await axios({
                method: 'get',
                url: `https://saavn.me/song?id=${favdata[s]}`
            })
            y.push(data.data)
        }
        for (v = 0; v < y.length; v++) {
            tu = y[v].song_duration

            const min_time = Math.floor(tu / 60)
            const sec_time = (tu % 60)
            const song_duration = (min_time + ":" + sec_time)
            res.write(`<div class="audioitem" onclick="avail('${y[v].song_id}')">
                    <div class="audiofile">
                        <div class="audioicon">
                            <img src="${y[v].song_image}" width="100%" height="100%" alt="">

                        <span class="material-icons material-icons-outlined">
                            play_arrow
                        </span>
                    </div>
                    <div class="audname">
                        ${y[v].song_name}
                    </div>
                </div>
                <div class="filedate">
                    ${y[v].song_artist}
                </div>
                <div class="filedate">
                    ${y[v].album_name} | ${y[v].song_language}
                </div>
                <div class="audduration">
                    ${song_duration} min
                </div>
            </div>`)
        }
        res.end()

    }).catch(err => {
        fjhjakhdkjfhs = ''
    })
})
module.exports = app