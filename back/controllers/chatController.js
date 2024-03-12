//Isa
const { response, request } = require('express');
const queriesChat = require("../database/queries/queries-chat");
const chat = require("./socketController");

const Listado = async (req, res = response) => {
    queriesChat.getListado().then((mensajes) => {
        res.status(200).json({
            success: true,
            data: mensajes,
            msg: 'Mensajes obtenidos'
        });
    }).catch((err) => {

        res.status(203).json({
            success: false,
            data: null,
            msg: 'No se han podido obtener'
        });
    });
}
const ListadoBloqueados = async (req, res = response) => {
    queriesChat.getListaBloqueados().then((bloqueados) => {
        res.status(200).json({
            success: true,
            data: bloqueados,
            msg: 'Usuarios obtenidos'
        });
    }).catch((err) => {

        res.status(203).json({
            success: false,
            data: null,
            msg: 'No se han podido obtener'
        });
    });
}
const ComprobarEstado = async (req, res = response) => {
    queriesChat.ComprobarEstado(req.body.id).then((user) => {
        let bloqueado = false;
        if (user.dataValues.bloqueado == 1) {
            bloqueado = true;
        }
        res.status(200).json({
            success: true,
            data: bloqueado,
            msg: 'Estado comprobado'
        });
    }).catch((err) => {

        res.status(203).json({
            success: false,
            data: null,
            msg: 'No se pudo comprobar estado'
        });
    });
}
const ListadoDesbloqueados = async (req, res = response) => {
    queriesChat.getListaDesbloqueados().then((desbloqueados) => {
        res.status(200).json({
            success: true,
            data: desbloqueados,
            msg: 'Usuarios obtenidos'
        });
    }).catch((err) => {

        res.status(203).json({
            success: false,
            data: null,
            msg: 'No se han podido obtener'
        });
    });
}
const obtenerEstadoChat = async (req, res = response) => {
    queriesChat.getEstadoChat().then((respuesta) => {
        res.status(200).json(respuesta);
    }).catch((err) => {

        res.status(203).json({
            success: false,
            data: null,
            msg: 'No se han podido obtener'
        });
    });
}
const actulizarEstadoChat = async (req, res = response) => {
    queriesChat.actulizarEstadoChat(req.body.estado).then((respuesta) => {
        res.status(200).json(respuesta);
    }).catch((err) => {
        res.status(203).json({
            success: false,
            data: null,
            msg: 'No se han podido actualizar'
        });
    });
}


const borrarMensajes = async (req, res = response) => {
    queriesChat.borrarTodo().then((mensaje) => {
        res.status(200).json({
            success: true,
            data: mensaje,
            msg: 'Mensaje borrados'
        });
    }).catch((err) => {

        res.status(203).json({
            success: false,
            data: null,
            msg: 'No se han podido borrar'
        });
    });
}


module.exports = {
    Listado,
    borrarMensajes,
    ListadoDesbloqueados,
    ListadoBloqueados,
    ComprobarEstado,
    obtenerEstadoChat,
    actulizarEstadoChat
}