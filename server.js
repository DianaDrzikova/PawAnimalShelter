const express = require("express")
const app = express()
const bodyParser = require('body-parser')
const expressLayout = require("express-ejs-layouts")
const client = require("./databasepg")
const bcrypt = require('bcrypt')

const cookieParser = require("cookie-parser");
const session = require('express-session');
var methodOverride = require('method-override')
const fileUpload = require('express-fileupload')
var path = require('path')

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    cookie : {maxAge: 1800000},
    rolling: true,
    saveUninitialized: true
}))

const animalrouter = require("./routes/animalRoute")
const reservationrouter = require("./routes/reservatonRoute")
const userrouter = require("./routes/userRoute")
const appointmentrouter = require("./routes/appointmentRoute")


app.use(methodOverride('_method'))

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(fileUpload())
app.use(cookieParser());

app.set('views', [__dirname + '/views', __dirname + '/views/caregiver', __dirname + '/views/volunteer', __dirname + '/views/veterinarian', __dirname + '/views/unregistered']);
app.set("view engine", "ejs")
app.set("partials", __dirname + "/views/partials")
app.set("layout", "layouts/layout")
app.use(expressLayout)
app.use(express.static("public"))
app.use(express.static('CSS'))
app.use("/images", express.static('images'))
app.use('/img', express.static(__dirname+'/files'))


client.connect();


app.use("/", animalrouter)
app.use("/", reservationrouter)  
app.use("/", userrouter)  
app.use("/", appointmentrouter)


app.listen(process.env.PORT || 3000)

module.exports = app;
