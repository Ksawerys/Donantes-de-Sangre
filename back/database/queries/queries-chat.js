//Isa
const sequelize = require('../ConexionSequelize');
const models = require('../../models/index.js');
const moment = require('moment');
const metodosFecha = require('../../helpers/fechas');

class QueriesChat {
    constructor() {
        this.sequelize = sequelize;
    }
    getListado = async () => {
        let mensajes = "";
        let c = [];
        try {
            this.sequelize.conectar();
            mensajes = await models.Chat.findAll();
            if (mensajes != null) {
                let data = "";
                mensajes.forEach(m => {
                    let fecha = "";
                    let hora = "";
                    hora = moment(m.dataValues.createdAt, 'HH:mm').format('HH:mm');
                    fecha = new Date(m.dataValues.createdAt).toLocaleDateString();
                    //Se deja creado por si da problemas con la hora.
                    /*
                    let fechaDb = new Date(m.dataValues.createdAt);
                    fechaDb.setHours(fechaDb.getHours() + 2);
                    
                    if (!metodosFecha.comprobarHoraFecha(fechaDb, m.dataValues.createdAt)) {
                        hora = moment(m.dataValues.createdAt, 'HH:mm').subtract(2, 'hour').format('HH:mm');
                    } else {
                        hora = moment(m.dataValues.createdAt, 'HH:mm').format('HH:mm');
                    }
                    */
                    data = {
                        "idMensaje": m.dataValues.id,
                        "idUser": m.dataValues.idUser,
                        "nombre": m.dataValues.nombreUser,
                        "mensaje": m.dataValues.mensaje,
                        "fecha": fecha,
                        "hora": hora
                    }
                    c.push(data);
                });
            }
            this.sequelize.desconectar();
        } catch (err) {
            this.sequelize.desconectar();
            throw err;
        }
        return c;
    }
    addMensaje = async (datos) => {

        let data = "";
        let respuesta = "";
        this.sequelize.conectar();
        try {
            let mensaje = await models.Chat.create({
                idUser: datos.id,
                nombreUser: datos.nombreUser,
                mensaje: datos.mensaje
            });
            let hora = moment(mensaje.dataValues.createdAt, 'HH:mm').format('HH:mm');
            let fecha = new Date(mensaje.dataValues.createdAt).toLocaleDateString();

            data = {
                "idMensaje": mensaje.dataValues.id,
                "idUser": datos.id,
                "nombre": datos.nombreUser,
                "mensaje": datos.mensaje,
                "fecha": fecha,
                "hora": hora
            }
            this.sequelize.desconectar();

        } catch (err) {
            this.sequelize.desconectar();
            throw err;
        }
        respuesta = {
            success: true,
            data: data,
            msg: 'Mensaje creado'
        }
        return respuesta;
    }
    borrarTodo = async () => {
        let respuesta = "";
        this.sequelize.conectar();
        try {
            let mensajes = await models.Chat.findAll();
            if (!mensajes) {
                this.sequelize.desconectar();
                throw error;
            }
            for (let index = 0; index < mensajes.length; index++) {
                await mensajes[index].destroy();
            }
        } catch (err) {
            this.sequelize.desconectar();
            throw err;
        }
        this.sequelize.desconectar();
        respuesta = {
            success: true,
            data: [],
            msg: 'Todos los mensajes eliminados'
        }
        return respuesta;
    }
    /*Corregir metodo añadiendo una respuesta*/
    borrarMensaje = async (id) => {
        this.sequelize.conectar();
        let todos = "";
        let respuesta = "";
        let c = [];
        try {
            let mensaje = await models.Chat.findByPk(id);
            if (!mensaje) {
                this.sequelize.desconectar();
                throw error;
            }
            await mensaje.destroy();
            todos = await models.Chat.findAll();
            if (todos != null) {
                let data = "";
                todos.forEach(m => {
                    let fecha = "";
                    let hora = "";
                    hora = moment(m.dataValues.createdAt, 'HH:mm').format('HH:mm');
                    fecha = new Date(m.dataValues.createdAt).toLocaleDateString();
                    data = {
                        "idMensaje": m.dataValues.id,
                        "idUser": m.dataValues.idUser,
                        "nombre": m.dataValues.nombreUser,
                        "mensaje": m.dataValues.mensaje,
                        "fecha": fecha,
                        "hora": hora
                    }
                    c.push(data);
                });
            }
            this.sequelize.desconectar();
        } catch (err) {
            this.sequelize.desconectar();
            throw err;
        }
        respuesta = {
            success: true,
            data: c,
            msg: 'Se ha eliminado el mensaje'
        }

        return respuesta;
    }

    actulizarEstadoUsuario = async (ids, condicion) => {
        let resp = true;
        let usuario = "";
        let u = [];
        try {
            this.sequelize.conectar();
            for (let index = 0; index < ids.length; index++) {
                usuario = await models.User.findByPk(ids[index]);
                usuario.update({ bloqueado: condicion });
                usuario.save();
                u.push(ids[index]);
            }
            this.sequelize.desconectar();

            resp = {
                success: true,
                data: u,
                msg: 'Se han actualizado los estados'
            }

        } catch (err) {
            resp = false;
            this.sequelize.desconectar();
            throw err;
        }
        return resp;
    }

    getListaBloqueados = async () => {
        let bloqueados = "";
        let users = [];
        try {
            this.sequelize.conectar();
            bloqueados = await models.User.findAll({
                attributes: ['id', 'nombre'],
                where: {
                    bloqueado: 1
                },
                order: [['nombre', 'ASC']]

            });
            if (bloqueados != null) {
                bloqueados.forEach(u => {
                    users.push({ id: u.dataValues.id, nombre: u.dataValues.nombre });
                });
            }
            this.sequelize.desconectar();
        } catch (err) {
            this.sequelize.desconectar();
            throw err;
        }
        return users;
    }
    getListaDesbloqueados = async () => {
        let desbloqueados = "";
        let users = [];
        try {
            this.sequelize.conectar();
            desbloqueados = await models.User.findAll({
                attributes: ['id', 'nombre'],
                where: {
                    bloqueado: 0
                },
                order: [['nombre', 'ASC']],

            });
            if (desbloqueados != null) {
                desbloqueados.forEach(u => {
                    users.push({ id: u.dataValues.id, nombre: u.dataValues.nombre });
                });
            }
            this.sequelize.desconectar();
        } catch (err) {
            this.sequelize.desconectar();
            throw err;
        }
        return users;
    }
    ComprobarEstado = async (id) => {
        let usuario = "";
        try {
            this.sequelize.conectar();
            usuario = await models.User.findByPk(id, { attributes: ["bloqueado"] });
            this.sequelize.desconectar();
        } catch (err) {
            this.sequelize.desconectar();
            throw err;
        }

        return usuario;
    }
    actulizarEstadoChat = async (estado) => {
        let resp = "";
        let parametro = "";
        try {
            this.sequelize.conectar();
            parametro = await models.ParametrosGenerales.findByPk(2);
            parametro.update({ valor: estado });
            parametro.save();
            resp = { success: true, data: parametro.dataValues.valor, msg: "Se ha cambiado el estado del chat" }
            this.sequelize.desconectar();
        } catch (err) {
            this.sequelize.desconectar();
            throw err;
        }

        return resp
    }
    getEstadoChat = async () => {
        let resp = "";
        let parametro = "";
        try {
            this.sequelize.conectar();
            parametro = await models.ParametrosGenerales.findByPk(2);
            resp = { success: true, data: parametro.dataValues.valor, msg: "Se ha cambiado el estado del chat" }
            this.sequelize.desconectar();
        } catch (err) {
            this.sequelize.desconectar();
            throw err;
        }

        return resp
    }
}



const queriesChat = new QueriesChat();
module.exports = queriesChat;