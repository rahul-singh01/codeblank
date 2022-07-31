const express = require("express");
var path = require("path");
const app = express();
const fs = require("fs");

//databse connection
require('./config/database')()

// public access
app.use(express.static(path.join(__dirname, 'public')))

//Adding url encoders
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Engine Setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// selfbuid modules imports
var auth = require("./routes/cbmanager_auth/auth")
var cbaudio = require("./routes/cbaudio/cbaudio_server")
var cbmanager_server = require("./routes/cbmanager_server")
var sharelink = require("./controllers/sharelink")

// selfbuild server routes
app.use('/', auth)
app.use('/', cbaudio)
app.use('/', cbmanager_server)
app.use('/', sharelink)

// Welcome page
app.get("/", (req, res) => {
    res.render(__dirname + "/views/header_footer/layout.ejs", { data: false });
});

// main index routing...

///////////////////////////////////////////////////////////////

// listening to heart
const hostname = '127.0.0.1';
const port = process.env.PORT || 3000;


const server = app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

// let io = require('socket.io')(server)