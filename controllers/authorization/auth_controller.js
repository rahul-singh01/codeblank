const User = require('../../config/models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

function initialise_auth_controller() {
    return {
        login(req, res) {
            //get
            res.render('auth_html/cblogin.ejs', { "error": "" })
        },

        signup(req, res) {
            //get
            res.render('auth_html/cbsignup.ejs', { "message": "", "uname": '', "error": "" })

        },

        async post_signup(req, res) {

            // post signup request

            const { name, full_name, email, password } = req.body


            if (!name || !full_name || !email || !password) {
                res.send('All fields are required')
            } else {

                const hashedpassword = await bcrypt.hash(password, 10)

                const user_in = new User({
                    username: req.body.name,
                    fullname: req.body.full_name,
                    email: req.body.email,
                    password: hashedpassword
                })

                await user_in.save()

                User.findOne({ username: req.body.name }, async(err, result) => {
                    try {
                        if (result) {
                            const token_data = {
                                username: result.username,
                                user_id: result._id.toString(),
                            }
                            var token = await jwt.sign(JSON.stringify(token_data), process.env.privateKey)
                            res.render('auth_html/tips.ejs', { "token": `${token}`, "username": `${result.username}` })
                        } else {
                            res.render('auth_html/cbsignup.ejs', { "error": "Internal server error contact developer !!" })
                        }
                    } catch (err) {
                        res.render('auth_html/cbsignup.ejs', { "error": "Error in making credentials" })
                    }

                })

            }

        },

        async post_check(req, res) {

            User.exists({ username: req.body.uname }, (err, results) => {
                if (results) {
                    res.render('auth_html/cbsignup.ejs', { "message": "Username Already Exists !", "uname": '', "error": '' });
                } else if (req.body.uname.length < 3) {
                    res.render('auth_html/cbsignup.ejs', { "message": "Atleast 3 character required", "uname": "", "error": '' })
                } else {
                    res.render('auth_html/cbsignup.ejs', { "message": "Username Available ", "uname": req.body.uname, "error": err })

                }

            })

        },

        async post_login(req, res, next) {
            const { username, password } = req.body
            console.log(username, password)
            if (!username || !password) {
                res.render('auth_html/cblogin.ejs', { "error": "Fields Cannot be empty!" })
            }
            User.findOne({ username: username }, async(err, result) => {
                try {
                    const match = await bcrypt.compare(password, result.password)
                    if (match) {
                        const token_data = {
                            username: result.username,
                            user_id: result._id.toString(),
                        }
                        var token = await jwt.sign(JSON.stringify(token_data), process.env.privateKey)
                        res.render('auth_html/tips.ejs', { "token": `${token}`, "username": `${result.username}` })
                    } else {
                        res.render('auth_html/cblogin.ejs', { "error": "Invalid Login Credentials !" })
                    }
                } catch (err) {
                    res.render('auth_html/cblogin.ejs', { "error": "User Not Exist" })
                }

            })

        },
        async post_login_final(req, res) {
            const { token } = req.body
            const verify = await jwt.verify(token, process.env.privatekey)
            const data = {
                username: verify.username,
                userid: verify.user_id,

            }
            res.render('header_footer/layout.ejs', { data: data })

        },
        async verify_token(req, res) {
            const { token } = req.body
            const verify = await jwt.verify(token, "dirty_cb_manager")
            const data = {
                username: verify.username,
                userid: verify.user_id,
            }
            res.render('cbmanager.ejs', { data: data })
        }


    }

}
module.exports = initialise_auth_controller