const mongoose = require('mongoose')

const Schema = mongoose.Schema

const set_of_conditions = {
    cbaudio: true,
    playlist: true,
    cbvideo: true,

}

const User = new Schema({
    username: { type: 'String', required: true, unique: true, minlength: 3 },
    fullname: { type: 'string', required: true },
    email: { type: 'string', required: false, unique: true },
    password: { type: 'string', required: true },
    set_of_conditions: { type: 'object', default: set_of_conditions }

}, { timestamps: true });

module.exports = mongoose.model('User', User)