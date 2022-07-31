const app = require('express').Router()
const auth_controller = require('../../controllers/authorization/auth_controller')


app.get("/cblogin", auth_controller().login);

app.post("/cblogin", auth_controller().post_login);

app.post("/", auth_controller().post_login_final);

app.post("/verifytoken", auth_controller().verify_token)

app.get("/cbsignup", auth_controller().signup);

app.post("/cbsignup", auth_controller().post_signup);

app.post("/cbsignup_checkuser", auth_controller().post_check);

module.exports = app