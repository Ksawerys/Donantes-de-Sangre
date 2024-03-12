const sequelize = require('../ConexionSequelize');
const models = require('../../models/index.js');
const fileUpload = require('express-fileupload');
const File = require('../../helpers/fileUpload');
const assets = require('../../helpers/irAssets');
const path = require('path');
const fs = require("fs");
//Todo Alejandro
class queriesAptoSangre {

    constructor() {
        this.sequelize = sequelize; 
    }


    getPreguntas = async() => {
        this.sequelize.conectar();
        let resultado = [];

        try {

            resultado = await models.Pregunta.findAll();
            this.sequelize.desconectar();

        } catch(error) {

            this.sequelize.desconectar();
            throw error;
        }
        return resultado
    }


    getPregunta = async(id) => {
        this.sequelize.conectar();
        const pregunta = await models.Pregunta.findByPk(id);
        this.sequelize.desconectar();
        return pregunta;
    }

    generarPregunta = async(req) => {
        let data = "";
        this.sequelize.conectar();
        try {
            
            if (!req.files) {
                let pregunta = await models.Pregunta.create({
                    enunciado: req.body.enunciado,
                    titulo: req.body.titulo,
                    respuesta: req.body.respuesta,
                    solucion_problema: req.body.solucion_problema
                });

                data = {
                    "id": pregunta.id,
                    "enunciado": pregunta.enunciado,
                    "titulo": pregunta.titulo,
                    "nombre_img": "",
                    "respuesta": pregunta.respuesta,
                    "solucion_problema": pregunta.solucion_problema
                }

            } else {
                const imagen = await File.subirArchivo(req.files.archivo, undefined, 'apto_sangre');
                assets.copiarAssests('apto_sangre', 'apto_sangre', imagen);
                let pregunta = await models.Pregunta.create({
                    enunciado: req.body.enunciado,
                    titulo: req.body.titulo,
                    respuesta: req.body.respuesta,
                    nombre_img: imagen,
                    solucion_problema: req.body.solucion_problema
                });
                data = {
                    "id": pregunta.id,
                    "enunciado": pregunta.enunciado,
                    "titulo": pregunta.titulo,
                    "nombre_img": imagen,
                    "respuesta": pregunta.respuesta,
                    "solucion_problema": pregunta.solucion_problema
                }

            }
        } catch (err) {
            throw err;
        }

        this.sequelize.desconectar();
        return data;
    }

    actualizarPregunta = async(req) => {
        let data = "";

        this.sequelize.conectar();
        try {
            
            let pregunta = await models.Pregunta.findOne(
                {
                    where: { id: req.params.id }
                });
            
            if (pregunta) {
                if (!req.files) {
                    pregunta.id = pregunta.id;
                    pregunta.enunciado = req.body.enunciado;
                    pregunta.titulo = req.body.titulo;
                    pregunta.nombre_img = pregunta.nombre_img;
                    pregunta.respuesta = req.body.respuesta;
                    pregunta.solucion_problema = req.body.solucion_problema;
                    const resp = await pregunta.save();


                    data = {
                        "id": resp.id,
                        "enunciado": resp.enunciado,
                        "titulo": resp.titulo,
                        "nombre_img": resp.nombre_img,
                        "respuesta": resp.respuesta,
                        "solucion_problema": resp.solucion_problema
                    }

                } else {

                    let pathImagen = path.join(__dirname, '../../uploads', "apto_sangre", pregunta["nombre_img"]);
                    if (fs.existsSync(pathImagen)) {
                        fs.unlinkSync(pathImagen);
                    }
                    pathImagen = path.join(__dirname, '../../../front/src/assets/imagenes', "apto_sangre", pregunta["nombre_img"]);
                    if(fs.existsSync(pathImagen)) {
                        fs.unlinkSync(pathImagen);
                    }

                    const nombre_img = await File.subirArchivo(req.files.archivo, undefined, 'apto_sangre');
                    assets.copiarAssests('apto_sangre', 'apto_sangre', nombre_img);


                    pregunta.id = pregunta.id;
                    pregunta.enunciado = req.body.enunciado;
                    pregunta.titulo = req.body.titulo;
                    pregunta.nombre_img = nombre_img;
                    pregunta.respuesta = req.body.respuesta;
                    pregunta.solucion_problema = req.body.solucion_problema;
                    const resp = await pregunta.save();
                    
                    data = {
                        "id": resp.id,
                        "enunciado": resp.enunciado,
                        "titulo": resp.titulo,
                        "nombre_img": resp.nombre_img,
                        "respuesta": resp.respuesta,
                        "solucion_problema": resp.solucion_problema
                    }

                    

                }
            }

        } catch (err) {
            throw err;
        }

        this.sequelize.desconectar();
        return data;
    }

    eliminarPregunta = async(id) => {
        this.sequelize.conectar();
        let pregunta = await models.Pregunta.findOne({
            where: { id: id }
        });

        if (!pregunta) {
            this.sequelize.desconectar();
            throw error;
        }
        
        if (pregunta["nombre_img"] != "") {

            let pathImagen = path.join(__dirname, '../../uploads', "apto_sangre", pregunta["nombre_img"]);
            if (fs.existsSync(pathImagen)) {
                fs.unlinkSync(pathImagen);
            }
            pathImagen = path.join(__dirname, '../../../front/src/assets/imagenes', "apto_sangre", pregunta["nombre_img"]);
            if(fs.existsSync(pathImagen)) {
                fs.unlinkSync(pathImagen);
            }
        }

        await pregunta.destroy();

        this.sequelize.desconectar();
        return pregunta;
    }
}
const queries_AptoSangre = new queriesAptoSangre();


module.exports = queries_AptoSangre;