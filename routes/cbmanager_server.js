const app = require('express').Router()
const User = require('../config/models/User')

app.get("/cbwelcome", (req, res) => {
    res.render("cbwelcome.ejs")

});
app.get("/cbmanager", (req, res) => {
    res.render("cbmanager.ejs", { data: false })

});

app.get("/:obj_id/cbaudio", (req, res) => {
    const id = req.params.obj_id
    data = {
        userid: id
    }
    res.render("cbaudio.ejs", { data: data })

});

app.get("/:obj_id/cbvideo", (req, res) => {
    res.render("cbvideo.ejs")

});

module.exports = app