const sequelize = require('../ConexionSequelize');
const fs = require("fs");
const path = require('path');
const fileUpload = require('express-fileupload');
const models = require('../../models/index.js');
const assets = require('../../helpers/irAssets');
const queriesUsers = require('./queriesUsers');
const queries_Galeria = require('./queriesGaleria');
const Sequelize = require('sequelize');
//Todo Alejandro
class Queries_Notificacion {

    constructor() {
        this.sequelize = sequelize; 
    }
    getNotificaciones = async() => {
        this.sequelize.conectar();
        let resultado = [];
        try {
            resultado = await models.Notificacion.findAll();
            this.sequelize.desconectar();
        } catch(error) {
            this.sequelize.desconectar();
            throw error;
        }
        return resultado;
    }

    getNotificacionUser = async(idUser) => {
        this.sequelize.conectar();
        try{
            let notificacion = null;
            let notificacionesAdministrador = await models.Notificacion.findAll({
                where: {
                    idUsuarioAdministrador: idUser
                    
                },
                include: [
                    {
                        model: models.PeticionesGaleria,
                        attributes: [],
                        include: [
                            {
                                model: models.User,
                                attributes: []
                            }
                        ]
                    }
                ],
                order: [['createdAt', 'DESC']],

                attributes: ["id", "titulo", "mensaje", "galeriaPeticionID", "idUsuarioRegistrado", 
                "idUsuarioAdministrador","leido", "createdAt", 
                [Sequelize.col('PeticionesGalerium.propietario'), 'propietario'],
                [Sequelize.col('PeticionesGalerium.nombre'), 'nombreImagen'],
                [Sequelize.col('PeticionesGalerium.descripcion'), 'descripcionImagen'],
                [Sequelize.col('PeticionesGalerium.verificado'), 'verificadoImagen'],
                [Sequelize.col('PeticionesGalerium.aceptado_rechazado'), 'aceptado_rechazadoImagen'],
                [Sequelize.col('PeticionesGalerium.User.nombre'), 'nombrePropietarioUser']]
                
            });
            console.log(notificacionesAdministrador.length);
            let notificacionesRegistrado = await models.Notificacion.findAll({
                where: {
                    idUsuarioRegistrado: idUser
                },
                include: [
                    {
                        model: models.PeticionesGaleria,
                        attributes: [],
                        include: [
                            {
                                model: models.User,
                                attributes: []
                            }
                        ]
                    }
                ],
                order: [['createdAt', 'DESC']],
                attributes: ["id", "titulo", "mensaje", "galeriaPeticionID", "idUsuarioRegistrado", 
                "idUsuarioAdministrador","leido", "createdAt", 
                [Sequelize.col('PeticionesGalerium.propietario'), 'propietario'],
                [Sequelize.col('PeticionesGalerium.nombre'), 'nombreImagen'],
                [Sequelize.col('PeticionesGalerium.descripcion'), 'descripcionImagen'],
                [Sequelize.col('PeticionesGalerium.verificado'), 'verificadoImagen'],
                [Sequelize.col('PeticionesGalerium.aceptado_rechazado'), 'aceptado_rechazadoImagen'],
                [Sequelize.col('PeticionesGalerium.User.nombre'), 'nombrePropietarioUser']]
            })
            console.log(notificacionesRegistrado.length);
            if(notificacionesAdministrador.length == 0){
                notificacion = notificacionesRegistrado;
            }
            else{
                notificacion = notificacionesAdministrador;
            }
            this.sequelize.desconectar();
            return notificacion;
        }catch(err){
            this.sequelize.desconectar();
            throw err
        }
    }

    postCrearNotificacionesAdministradores = async(idUser, idImagenPeticion, idAdministrador) => {
        this.sequelize.conectar();
        let data = [];
        try {
            const usuario = await queriesUsers.getUser(idUser);
            
            const imagen = await queries_Galeria.getGaleriaPeticion_Imagen(idImagenPeticion);
            let notificacion = await models.Notificacion.create();
            notificacion.id = null;
            notificacion.titulo = "Peticion de foto";
            notificacion.mensaje = `El usuario <strong>${(usuario.nombre)}</strong> quiere realizar una peticion de subir una foto`;
            notificacion.galeriaPeticionID = imagen.id;
            notificacion.idUsuarioAdministrador = idAdministrador;
            notificacion.idUsuarioRegistrado = null;
            notificacion.leido = false;
            const resp = await notificacion.save();
                data = {
                    "id": resp.id,
                    "titulo": notificacion.titulo,
                    "mensaje": notificacion.mensaje,
                    "galeriaPeticionID": notificacion.galeriaPeticionID,
                    "idUsuarioAdministrador": idAdministrador,
                    "idUsuarioRegistrado": notificacion.idUsuarioRegistrado,
                    "¿Esta leido?": notificacion.leido,
                    "Created at": notificacion.createdAt,
                    "Updated at": notificacion.updatedAt
                }
            
        
            this.sequelize.desconectar();
            
        } catch(error) {
            this.sequelize.desconectar();
            throw error;
        }
        return data;
    }

    postCrearNotificacionAceptarUsuario = async(idUser, idImagenPeticion) => {
        this.sequelize.conectar();
        let data = "";
        try {
            const usuario = await queriesUsers.getUser(idUser);
            const imagen = await queries_Galeria.getGaleriaPeticion_Imagen(idImagenPeticion);
            let notificacion = await models.Notificacion.create();
            notificacion.id = null;
            notificacion.titulo = "Aceptacion de su foto";
            notificacion.mensaje = `El administrador ha aceptado su foto`;
            notificacion.galeriaPeticionID = imagen.id;
            notificacion.idUsuarioRegistrado = usuario.id;
            notificacion.idUsuarioAdministrador = null;
            notificacion.leido = false;
                const resp = await notificacion.save();
                data = {
                    "id": resp.id,
                    "titulo": notificacion.titulo,
                    "mensaje": notificacion.mensaje,
                    "galeriaPeticionID": notificacion.galeriaPeticionID,
                    "idUsuarioRegistrado": notificacion.idUsuarioRegistrado,
                    "idUsuarioAdministrador": notificacion.idUsuarioAdministrador,
                    "¿Esta leido?": notificacion.leido,
                    "Created at": notificacion.createdAt,
                    "Updated at": notificacion.updatedAt
                }
                this.sequelize.desconectar();
            
        } catch(error) {
            this.sequelize.desconectar();
            throw error;
        }
        return data;
    }

    postCrearNotificacionRechazarUsuario = async(idUser, idImagenPeticion) => {
        this.sequelize.conectar();
        let data = "";
        try {
            const usuario = await queriesUsers.getUser(idUser);
            const imagen = await queries_Galeria.getGaleriaPeticion_Imagen(idImagenPeticion);
            let notificacion = await models.Notificacion.create();
            notificacion.id = null;
            notificacion.titulo = "Rechazo de su foto";
            notificacion.mensaje = `El administrador ha rechazado su foto`;
            notificacion.galeriaPeticionID = imagen.id;
            notificacion.idUsuarioRegistrado = usuario.id;
            notificacion.idUsuarioAdministrador = null,
            notificacion.leido = false;
                const resp = await notificacion.save();
                data = {
                    "id": resp.id,
                    "titulo": notificacion.titulo,
                    "mensaje": notificacion.mensaje,
                    "galeriaPeticionID": notificacion.galeriaPeticionID,
                    "idUsuarioRegistrado": notificacion.idUsuarioRegistrado,
                    "idUsuarioAdministrador": notificacion.idUsuarioAdministrador,
                    "¿Esta leido?": notificacion.leido,
                    "Created at": notificacion.createdAt,
                    "Updated at": notificacion.updatedAt
                }
                this.sequelize.desconectar();
            
        } catch(error) {
            this.sequelize.desconectar();
            throw error;
        }
        return data;
    }

    putNotificacionLeida = async(idNotificacion, verdadero) => {
        this.sequelize.conectar();
        try{
            const notificacion = await models.Notificacion.findByPk(idNotificacion);
            console.log(notificacion);
            let usuario = null;
            if(notificacion.idUsuarioRegistrado == null){
                usuario = await models.User.findByPk(notificacion.idUsuarioAdministrador);
                
            }
            else{
                usuario = await models.User.findByPk(notificacion.idUsuarioRegistrado);
                
            }
            if(notificacion.leido == false){
                notificacion.leido = verdadero;
                await notificacion.save();
                usuario.notificacion = usuario.notificacion - 1;
                await usuario.save();
            }
            
            this.sequelize.desconectar();
            return notificacion;
        }catch(error){
            this.sequelize.desconectar();
            throw error;
        }
    }
    
    borrarNotificacion = async(idNotificacion) => {
        this.sequelize.conectar();
        
        try{
            const notificacion = await models.Notificacion.findByPk(idNotificacion);
            
            
            await notificacion.destroy();
            this.sequelize.desconectar();
            return notificacion;
        }catch(error){
            this.sequelize.desconectar();
            throw error;
        }
    }
}

const queries_Notificacion = new Queries_Notificacion();

module.exports = queries_Notificacion;