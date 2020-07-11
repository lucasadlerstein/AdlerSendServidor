const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs');
const Enlaces = require('../models/Enlace');

exports.subirArchivo = async (req, res, next) => {

    const multerConfiguracion = {
        limits: {fileSize: req.usuario ? 1024*1024*10 : 1024*1024}, //10MB autenticado o  1MB sin cuenta
        storage: fileStorage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, __dirname+'/../uploads')
            },
            filename: (req, file, cb) => {
                // const extension = file.mimetype.split('/')[1];
                const extension = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
                cb(null, `${shortid.generate()}${extension}`);
            }
        })
    }
    
    const upload = multer(multerConfiguracion).single('archivo');

    upload(req, res, async (error) => {
        if(!error){
            res.json({ archivo: req.file.filename });
        }else{
            return next();
        }
    });

    setTimeout(() => {
        try {
            fs.unlinkSync(__dirname + `/../uploads/${req.file.filename}`);
        } catch (error) {
            console.log(error);
        }
    }, 604800000); // 7 dias en MS
}

exports.eliminarArchivo = async (req, res) => {

    try {
        fs.unlinkSync(__dirname + `/../uploads/${req.archivo}`);
    } catch (error) {
        console.log(error);
    }
}

exports.descargar = async(req, res, next) => {

    const enlace = await Enlaces.findOne({nombre: req.params.archivo });

    const archivo = __dirname + '/../uploads/' + req.params.archivo;
    res.download(archivo);

    // Elimiar archivo y entrada en la BD
    
    const {descargas, nombre} = enlace;
    // Si las descargas = 1: eliminar
    if(descargas  === 1) {
        // Eliminar entrada de DB
        req.archivo = nombre;
        await Enlaces.findOneAndRemove(enlace.id);

        // Eliminar el archivo
        next();
    }else{
        // Si las descargas > a 1: restar descarga
        enlace.descargas--;
        await enlace.save();
    }
}