require('dotenv').config();
const queriesUsers = require('../database/queries/queriesUsers');
const userCan = require('../helpers/rolesAbilities');
const { response, request } = require('express');


const midAdmin = async (req, res, next) => {
    if (await userCan(req, ['leer', 'editar', 'borrar'])) {
        next();                                                      
    } else {
        return res.status(403).json({ msg: 'No estás autorizado' });
    }
}


const midUser = async (req, res, next) => {
    if (await userCan(req, ['leer'])) {
        next();                                           
    } else {
        return res.status(403).json({ msg: 'No estás autorizado' });
    }
}


const mismoUser = async(req, res, next) => {
    if (await queriesUsers.getMismoUser(req.idToken, req.body.codSeguridad) != null) {
        next();
    }
    else {
        return res.status(403).json({ msg: 'No estás autorizado' });
    }
}


module.exports = {
    midAdmin,
    midUser,
    mismoUser
}