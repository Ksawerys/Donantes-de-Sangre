const { response, request } = require('express');
const queriesUsers = require('../database/queries/queriesUsers');
const userHelper = require('../helpers/validators/usuario-validators');


const getUsers = async(req, res = response) => {

    try {

        const users = await queriesUsers.getUsers();

        let infoUsers = [];

        users.forEach(user => {
            infoUsers.push({
                id: user.id,
                nombre: user.nombre,
                dni: user.dni,
                gSanguineo: user.gSanguineo,
                nDonante: user.nDonante,
            });
        });

        res.status(200).json({success: true, data: infoUsers, msg: 'users devueltos con éxito'});
    }
    catch (err) {

        res.status(200).json({success: false, msg: 'se ha producido un error'});
    }
}


const updateUserPerfil = (req, res = response) => {

    try {

        const infoUser = {...req.body};
        delete infoUser.id;

        if (userHelper.dniValido(infoUser.dni)) {

            const resp = queriesUsers.updateUserPerfil(req.body.id, infoUser);
    
            res.status(201).json({success: true, msg: 'actualizado con éxito'});
        }
        else {
            
            res.status(200).json({success: false, msg: 'se ha producido un error'});
        }

    }
    catch (err) {

        res.status(200).json({success: false, msg: 'se ha producido un error'});
    }
}


const updateUserAdmin = (req, res = response) => {

    try  {

        const infoUser = {...req.body};
        delete infoUser.id;

        if (userHelper.gSanguineoValido(infoUser.gSanguineo)) {

            const resp = queriesUsers.updateUserAdmin(req.body.id, infoUser);

            res.status(200).json({success: true, msg: 'actualizado con éxito'});
        }
        else {

            res.status(200).json({success: false, msg: 'se ha producido un error'});
        }
    }
    catch (err) {

        res.status(200).json({success: false, msg: 'se ha producido un error'});
    }
}


module.exports = {
    updateUserPerfil,
    updateUserAdmin,
    getUsers
}