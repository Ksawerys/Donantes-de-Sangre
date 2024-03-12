const { response, request } = require('express');
const queriesUsers = require("../database/queries/queriesUsers");
const generarJWT = require('../helpers/generarJWT');
const correo = require('../helpers/mail');
const genPasswd = require('generate-password');
const titleCase = require('title-case');
const md5 = require('md5');
const googleVerify = require('../helpers/googleVerify');
const genCode = require('../helpers/genCode');
const HTMLs = require('../helpers/archivosHtml');
const models = require('../models/index.js');
const userCan = require('../helpers/rolesAbilities');
const { v4: uuidv4 } = require('uuid');


// Mario
const login = (req, res = response) => { // traer y comparar aquí o traer y volver a chocar con la db.

    console.log(' Login ----------------------------------------------------------------------------------------------------')
    queriesUsers.getUserLogin(req.body.email, req.body.passwd).then(user => { // get abilities
        const resp = {
            success: true,
            data: {
                id: user.id,
                nombre: user.nombre,
                codSeguridad: user.codSeguridad,
                token: generarJWT(user.id),
            },
            msg: 'logeado con éxito'
        }

        res.status(200).json(resp);
    }).catch(err => {

        const resp = {
            success: false,
            msg: 'fallo en la autenticación',
        }

        res.status(200).json(resp);
    });
}


// Mario
const googleSignin = async (req, res = response) => {

    const { credentials } = req.body;
    try {
        const { correo, nombre } = await googleVerify.googleVerify(credentials);
        const [email, creado] = await models.Email.findOrCreate({
            where: { email: correo }
        });
        let user = null;
        
        if (creado) {
            user = await queriesUsers.insertUser(email.id, nombre);
        }
        else {
            const existe = await queriesUsers.userExiste(email.id);
            if (!existe) user = await queriesUsers.insertUser(email.id, nombre);
            else user = await queriesUsers.getUser(email.id);
        }
        
        const resp = {
            success: true,
            data: {
                id: user.id,
                nombre: user.nombre,
                token: generarJWT(user.id),
            },
            msg: 'logeado con éxito'
        }
        
        return res.status(200).json(resp);
    }
    catch (err) {

        const resp = {
            success: false,
            msg: 'error en el registro'
        }

        return res.status(200).json(resp);
    }
}

// Mario
const register = async (req, res = response) => { // poner código
    const vKey = uuidv4();
   
    try {
        const emailUser = await queriesUsers.insertEmail(vKey, req.body.email);
        console.log('--------------------------------------------------------------------------------------------------------------------')
        const resp = await queriesUsers.insertUser(emailUser.id, titleCase.titleCase(req.body.nombre), req.body.passwd);
    
        correo.mandarCorreoActivacion(vKey, resp.id, req.body.email, 'activarCorreo');
        res.status(201).json({ success: true, msg: 'registrado con éxito' });
    } 
    catch (err) {
        console.log(err)
        const msg = (err.name == 'SequelizeUniqueConstraintError')
            ? 'usuario ya registrado'
            : 'se ha producido un error';

        res.status(200).json({ success: false, msg: msg });
    }
}


// Mario
const activarCorreo = (req, res = response) => {
    queriesUsers.updateVerificacionEmail(req.params.id, req.params.vKey)
        .then(resp => {
            if (resp) res.send(HTMLs.exitoVerificarEmail());
            else res.send(HTMLs.error());

        }).catch(err => {
            res.send(HTMLs.error());
        });
}


// Alicia
const activarNewsletter = (req, res = response) => {
    queriesUsers.updateVerificacionEmailNewsletter(req.params.id, req.params.vKey)
        .then(resp => { 
            if (resp) res.send(HTMLs.exitoVerificarNewsletter());
            else res.send(HTMLs.error());

        }).catch(err => {
            res.send(HTMLs.error())
        });

}


// Alicia
const mandarEmailNewsletter = async (req, res = response) => {
    const vKey = uuidv4();

    try {

        let resp = await queriesUsers.getEmail(req.body.email);

        if (resp == null) resp = await queriesUsers.insertEmailNewsletter(vKey, req.body.email);
        else resp = await queriesUsers.updateVKeyNewsletterEmail(vKey, resp.id);

        if (resp.newsletterVerifiedAt != null) {
            res.status(200).json({ success: false, msg: 'Ya estás suscrito' });
            
        } else {
            correo.mandarCorreoActivacion(vKey, resp.id, req.body.email, 'activarNewsletter')
            res.status(201).json({ success: true, msg: 'Enviado con éxito' });
        } 

    } catch (error) {
        res.status(200).json({ success: false, msg: 'Se ha producido un error' });
    }
}


// Alicia
const desactivarNewsletter = (req, res = response) => {
    queriesUsers.updateCancelarNewsletter(req.params.id)
        .then(resp => {
            if (resp) res.send(HTMLs.exitoBajaNewsletter());
            else res.send(HTMLs.error());
            
        }).catch(err => {
            res.send(HTMLs.error())
        });

}


// Mario
const mandarEmailRecuperarPasswd = async (req, res = response) => {

    try {
        // const emailUser = await queriesUsers.getEmailById(email); // req.params.id
        const cod = genCode(6);
        const contenido = {
            asunto: 'Recuperación de contraseña',
            cuerpoHtml: `
                Hola. Hemos recibido una solicitud de cambio de contraseña para tu cuenta de la Hermandad de Donantes de Sangre de Puertollano<br>
                Tu código: ${(cod)}.
            `
        }

        correo.mandarCorreo(req.body.email, contenido);

        const emailUser = await queriesUsers.getIdEmail(req.body.email);
        const respUser = await queriesUsers.updateCodRecPasswd(emailUser.id, cod);

        const resp = {
            success: true,
            id: respUser.user.id,
            msg: 'contraseña generada con éxito'
        }

        res.status(200).json(resp);
    }
    catch (err) {

        res.status(200).json({ success: false, msg: 'se ha producido un error' });
    }
}


// Mario
const recuperarPasswd = async (req, res = response) => {

    try {
        const user = await queriesUsers.getUser(req.params.id);

        let resp = null;
        if (req.body.cod == user.codRecPasswd) {
            const nuevaPasswd = genPasswd.generate();
            const nuevaPasswdHash = md5(nuevaPasswd);

            const respUpdate = await queriesUsers.updateUserPasswd(req.params.id, nuevaPasswdHash); // req.params.id

            const email = await queriesUsers.getEmailById(req.params.id);
            const contenido = {
                asunto: 'Cambio de contraseña',
                cuerpoHtml: `La nueva contraseña para tu cuenta: ${(nuevaPasswd)}.`
            }
            correo.mandarCorreo(email.email, contenido);

            resp = {
                success: true,
                id: user.id,
                msg: 'passwd cambiada con éxito'
            }
        }
        else {
            resp = {
                success: false,
                msg: 'se ha producido un error'
            }
        }

        res.status(200).json(resp);
    }
    catch (err) {

        const resp = { success: false, msg: 'ha sucedido un error' };

        res.status(200).json(resp);
    }
}

//Mario
const cambiarPasswd = async(req, res = response) => {

    try {

        const user = await queriesUsers.getUserCambiarPasswd(req.body.id, req.body.passwd);

        const resp = await queriesUsers.updateUserPasswd(user.id, req.body.passwdNueva);
        
        res.status(201).json({success: true, msg: 'passwd actualizada con éxito'});
    }
    catch (err) {

        res.status(200).json({success: false, msg: 'se ha producido un error'});
    }
}


// Alicia
const puedeModificar = async (req, res = response) => {
    let resp = { success: false }; 
    
    try {
        
        const autorizado = await userCan(req, ['leer', 'editar', 'borrar']);
        
        if (autorizado) {
            const user = queriesUsers.getUser(req.params.id);

            resp = {
                success: true,
                data: { //TODO: Debería borrar esto?
                    id: user.id,
                    nombre: user.nombre,
                    token: generarJWT(user.id),
                }
            }            
        };

        res.status(200).json(resp);

    } catch (err) {
        res.status(200).json(resp);
    }
}


const modContrasena = async(req, res = response) => {

    try {
        const id = await queriesUsers.getUserCambiarPasswd(req.body.id, req.body.passwd);
        if (id != null) {
            const respUp = await queriesUsers.updateUserPasswd(req.body.id, req.body.passwdNueva);
    
            const resp = {
                success: true,
                cod: 0,
                msg: 'contraseña modificada con éxito'
            };
    
            res.status(201).json(resp);
        }
        else {
    
            const resp = {
                success: false,
                cod: 1,
                msg: 'error de autenticación'
            }

            res.status(200).json(resp);
        }
    }
    catch (err) {

        const resp = {
            success: false,
            cod: 2,
            msg: 'se ha producido un error'
        }

        res.status(200).json(resp);
    }
}


const getInfoUser = async(req, res = response) => {

    try {
        const user = await queriesUsers.getUserInfo(req.params.id);

        res.status(200).json({success: true, data: user, msg: 'devuelto con éxito'});
    }
    catch(err) {

        res.status(200).json({success: false, msg: 'se ha producido un error'});
    }
}


module.exports = {
    login,
    register,
    googleSignin,
    activarCorreo,
    activarNewsletter,
    mandarEmailRecuperarPasswd,
    cambiarPasswd,
    getInfoUser,
    recuperarPasswd,
    puedeModificar,
    desactivarNewsletter,
    mandarEmailNewsletter,
    modContrasena

}
