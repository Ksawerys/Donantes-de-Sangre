const { response, request } = require('express');
const queriesMusica = require("../database/queries/queriesMusica");
const fs = require('fs');
const path = require('path');

//Todo Isa
const registrarCancion = async (req, res = response) => {
    queriesMusica.insertarCancion(req).then((cancion) => {
        res.status(200).json({
            success: true,
            data: cancion,
            msg: 'Registrada'
        });
    }).catch((err) => {
        
        res.status(203).json({
            success: false,
            data: null,
            msg: 'No se ha podido registrar'
        });
    });
}
const descargar = async (req, res = response) => {
    queriesMusica.getCancion(req.params.id).then((cancion) => {
        if (cancion) {
            const pathMusic = path.join(__dirname, '../uploads', 'musica', cancion.nombre);
            if (fs.existsSync(pathMusic)) {
                return res.download(pathMusic);
            }
        } else {
            res.status(203).json({
                success: false,
                data: null,
                msg: 'Audio encontrado'
            });
        }
    }).catch((err) => {
  
        res.status(203).json({
            success: false,
            data: null,
            msg: 'Audio encontrado'
        });
    });
}
const editarCancion = async (req, res = response) => {
    queriesMusica.modificarCancion(req).then((cancion) => {
        res.status(200).json({
            success: true,
            data: cancion,
            msg: 'Audio modificado'
        });
    }).catch((err) => {
       
        res.status(203).json({
            success: false,
            data: null,
            msg: 'No se ha podido modificar'
        });
    });
}

const obtenerCancion = async (req, res = response) => {

    queriesMusica.getCancion(req.params.id).then((cancion) => {
      
        if (cancion) {
            const pathMusic = path.join(__dirname, '../uploads', 'musica', cancion.nombre);
            if (fs.existsSync(pathMusic)) {
                return res.sendFile(pathMusic);
            }
        } else {
            res.status(203).json({
                success: false,
                data: null,
                msg: 'Audio no encontrado'
            });
        }
    }).catch((err) => {
    
        res.status(203).json({
            success: false,
            data: null,
            msg: 'Audio no encontrado'
        });
    });
}
const getCancion = async (req, res = response) => {
    queriesMusica.getCancion(req.body.id).then((cancion) => {
        if (cancion !== null) {
            data = {
                "id": cancion.id,
                "nombre": cancion.nombre,
                "titulo": cancion.titulo,
                "letra": cancion.letra,
                "cancion": process.env.URL_PETICION + process.env.PORT + "/api/musica/upload/" + cancion.id,
                "descarga": process.env.URL_PETICION + process.env.PORT + "/api/musica/download/" + cancion.id,
            }

            res.status(203).json({
                success: true,
                data: data,
                msg: 'Audio encontrado'
            });
        } else {
            res.status(203).json("No encontrada");
        }
    }).catch((err) => {
      
        res.status(203).json({
            success: false,
            data: null,
            msg: 'Audio no encontrado'
        });
    });
}
const borrarCancion = async (req, res = response) => {
    queriesMusica.borrarCancion(req.params.id).then((cancion) => {
        res.status(200).json({
            success: true,
            data: cancion,
            msg: 'Audio borrado'
        });
    }).catch((err) => {
       
        res.status(200).json({
            success: false,
            data: null,
            msg: 'El audio no se ha podido borrar'
        });
    });
}
const borrarTodo = async (req, res = response) => {
    queriesMusica.borrarTodo().then((cancion) => {
        res.status(200).json({
            success: true,
            data: cancion,
            msg: 'Todos los audios han sido eliminados'
        });
    }).catch((err) => {
       
        res.status(200).json({
            success: false,
            data: null,
            msg: 'Ha ocurrido un error y no se han podido eliminar'
        });
    });
}
const Listado = async (req, res = response) => {
    queriesMusica.getListado().then((canciones) => {
        if (canciones !== null) {
            let c = [];
            let data = "";
            canciones.forEach(cancion => {
                data = {
                    "id": cancion.id,
                    "nombre": cancion.nombre,
                    "titulo": cancion.titulo,
                    "letra": cancion.letra,
                    "cancion": process.env.URL_PETICION + process.env.PORT + "/api/musica/upload/" + cancion.id,
                    "descarga": process.env.URL_PETICION + process.env.PORT + "/api/musica/download/" + cancion.id,
                }
                c.push(data);
            });
            const respuesta = {
                success: true,
                data: c,
                msg: 'Audios encontrados'
            }
            res.status(200).json(respuesta);
        }
    }).catch((err) => {
        const respuesta = {
            success: false,
            data: null,
            msg: 'Audios no encontrados'
        }
        res.status(200).json(respuesta);
    });
}

module.exports = {
    registrarCancion,
    descargar,
    editarCancion,
    obtenerCancion,
    borrarCancion,
    borrarTodo,
    Listado,
    getCancion,
}