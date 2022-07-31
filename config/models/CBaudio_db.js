const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CBaudio_db = new Schema({
    userid: { type: 'string', required: true },
    username: { type: 'string', required: true },
    fullname: { type: 'string', required: true },
    uuid: { type: 'string', required: false, unique: true },
    fav_song: { type: 'array', required: true },
    playlistname: { type: 'array', required: true },
    user_playlist_data: { type: 'array', required: true },

}, { timestamps: true });

module.exports = mongoose.model('CBaudio_db', CBaudio_db)