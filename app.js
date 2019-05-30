const colors = require('colors')
const express = require('express')
const bodyparser = require('body-parser')
const bcrypt = require('bcrypt')
const jsonwebtoken = require('jsonwebtoken')
const expressjwt = require('express-jwt')


const process = require('process')
const filesystem = require('fs')


const app = express()
const puerto = process.argv[2];
var hash = ""
var jwtClaveRaw = filesystem.readFileSync('secrets.json')
var jwtClave = JSON.parse(jwtClaveRaw)
let miclave = jwtClave["key"]

app.use(bodyparser.json())
app.use(expressjwt({secret: miclave}).unless({path: ['/login','/register']}))

// PETICION GET NOTICIAS

app.get('/noticias', function (req, res) {
    console.log('peticion GET al path /noticias');
    var noticias = [{
        "titulo": "Un alpinista hace historia al ser el primero en no coronar el Everest",
        "autor": "Xavi.D",
        "timestamp": "1527383",
        "tags": ["alpi montaña"],
    }]
    res.send(noticias);

})

// PETICION POST REGISTER

app.post('/register', function (req, res) {
    console.log("Registrando usuario".red);
    hash = bcrypt.hashSync(req.body.password, 10)
    filesystem.writeFileSync('users.json', JSON.stringify({
        "Username": req.body.username,
        "password": hash
    }));
    res.send("Usuario creado")
})

// PETICION POST LOGIN

app.post('/login', function (req, res) {
    console.log("autentificando usuario".red);

    var rawData = filesystem.readFileSync('users.json')
    var data = JSON.parse(rawData)

    if (bcrypt.compareSync(req.body.password, data['password'])) {
        
        
        var token = jsonwebtoken.sign({
            username : req.body.username
        }, miclave)
        res.send("Bienvendio tu json web token es " + token)
    } else {
        res.send("Contraseña incorrecta")
    }
})



console.log(`Estamos escuchando en el puerto ${puerto}`.green);

app.listen(puerto)
