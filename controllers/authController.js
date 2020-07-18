const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config({path: 'variables.env'});
const {validationResult} = require('express-validator');


exports.autenticarUsuario = async (req, res, next) => {
    
    const {email, password} = req.body;
    
    // Revisar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array()});
    }

    // Buscar usuario a ver si esta registrado
    const usuario = await Usuario.findOne({email});
    if(!usuario) {
        res.status(401).json({msg: 'El usuario no existe'});
        return next();
    }

    // Verificar usuario y password
    if(bcrypt.compareSync(password, usuario.password)){
        // Crear JWT
        const token = jwt.sign({
            id: usuario._id,
            nombre: usuario.nombre
        }, process.env.SECRETA, {
            expiresIn: '8h'
        } );

        res.json({token});
    } else{
        res.status(401).json({msg: 'Password incorrecto'});
        return next();
    }


}

exports.usuarioAutenticado = (req, res) => {
    res.json({usuario: req.usuario});
}