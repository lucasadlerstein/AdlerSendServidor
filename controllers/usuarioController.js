const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const {validationResult} = require('express-validator');

exports.nuevoUsuario = async(req, res) => {

    // Mensajes de error de express validator
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array()});
    }

    const {email, password, nombre} = req.body;
    let usuario = await Usuario.findOne({email});

    if(usuario) {
        return res.status(400).json({msg: "El usuario ya existe"});
    }

    usuario =  new Usuario(req.body);
    
    // Pass Hash
    const salt = await bcrypt.genSaltSync(10);
    usuario.password = await bcrypt.hashSync(password, salt);

    try {
        await usuario.save();
        res.json({msg: "Usuario creado con éxito"});    
    } catch (error) {
        console.log(error);
    }

}