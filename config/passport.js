const LocalStrategy = require('passport-local').Strategy
const User = require('../config/models/User')
const bcrypt = require('bcrypt')

function init(passport) {
    passport.use(new LocalStrategy({ usernameField: 'username' }, async(username, password, done) => {

        const user = await User.findOne({ username: username })
        if (!user) {
            return done(null, false, { message: "no user with this email !" })
        }
        bcrypt.compare(password, user.password).then(match => {
            if (match) {
                console.log(user.password)
                return done(null, user, { message: "logged in successfully" })
            } else {

                // return done(null, false, { message: "Wrong Credentials" })
                console.log('failed')

            }
        }).catch(err => {
            console.log(err)
            return done(err, false, { message: "logged in failed" })
        })

    }));

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user)
        })
    })
}

module.exports = init