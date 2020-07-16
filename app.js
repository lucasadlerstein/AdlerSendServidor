const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');
var compression = require('compression');

// Crear servidor
const app = express();

// Conectar DB
conectarDB();

console.log('Comenzando Node Send Express');


// Opciones CORS
const opcionesCors = {
    origin: process.env.FRONTEND_URL
}

// Habilitar cors
app.use(cors(opcionesCors));

// Habilitar compression
app.use(compression());

// Puerto de la app
const port = process.env.PORT || 4000;

// Habilitar leer valores del body
app.use(express.json());

// Habilitar carpeta publica
app.use(express.static('uploads'));

// Rutas de la app
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/enlaces', require('./routes/enlaces'));
app.use('/api/archivos', require('./routes/archivos'));


// Arranar la app
app.listen(port, '0.0.0.0', () => {
    console.log(`servidor funcionando en ${port}`);
})