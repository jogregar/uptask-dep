const express = require('express');
const routes = require("./routes");
const path = require("path"); // para poder usar las vistas
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');
require('dotenv').config();

// helpers con funciones
const helpers = require('./helpers');

// Creo la conexión a la base de datos
const db = require('./config/db');
const { port } = require('./config/email');

// Importamos el modelo
require('./modelos/Proyectos');
require('./modelos/Tareas');
require('./modelos/usuarios');

db.sync()
    .then(() => console.log('Conectado al servidor'))
    .catch(error => console.log(error));


// aqui creo una aplicación con express
const app = express();

// aqui le digo donde estan mis archivos estaticos
app.use(express.static('public'));

// aqui habilito el Pug
app.set('view engine', 'pug');

// aqui se habilita bodyparser para poder leer los datos de los formularios
app.use(bodyParser.urlencoded({extended: true}));

// Agregamos express validator a toda la aplicación
//app.use(expressValidator());

// aqui se añade la carpeta de las vistas
app.set('views', path.join(__dirname, './vistas'));

// agregamos flash messages
app.use(flash());

app.use(cookieParser());

// Sessiones para poder navegar entre distintas paginas sin volvernos a autenticar
app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// pasar var dump
app.use((req, res, next) => {
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user} || null;
    next();
});

app.use('/', routes());

// Servidor y puerto
const host = process.env.HOST || '0.0.0.0';
const ports = process.env.PORT || 3000;
app.listen(ports, host, () => {
    console.log('El servidor esta funcionando');
});


