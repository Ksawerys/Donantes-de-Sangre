const moment = require('moment');
const sequelize = require('../ConexionSequelize'); 
const conexion = require('../../database/Conexion');
const { Op, where } = require('sequelize');
const { getArrayCitas } = require('../../helpers/getRelaciones');
// const { use } = require('../../routes/routes');
const models = require('../../models/index.js');
const crypto = require('crypto');
const { UserRefreshClient } = require('google-auth-library');

class QueriesUsers {
    
    constructor() {
        this.sequelize = sequelize; 
        this.conexion = conexion;
    }


    //Mario
    getIdEmail = async(email) => {
        const id = await models.Email.findOne({
            attributes: ['id'],
            where: {
                email: email,
                emailVerifiedAt: {
                    [Op.ne]: null
                }
            }
        });

        return id.dataValues;
    }


    //Alicia
    getEmail = async(email) => {
        let resp = null;
        
        resp = await models.Email.findOne({
            where: {
                email: email
            }
        });

        return (resp == null) ? resp : resp.dataValues;
    }


    //Mario
    getEmailById = async(id) => {

        const resp = await models.Email.findByPk(id);

        return resp.dataValues;
    }


    //Mario
    getUser = async(id) => {
        const user = await models.User.findByPk(id);

        return user.dataValues;
    }


    //Mario
    getUsers = async() => {
        const users = await models.User.findAll();

        return users;
    }


    //Mario
    getMismoUser = async(id, codSeguridad) => {
        const user = await models.User.findOne({
            where: {
                id: id,
                codSeguridad: codSeguridad
            }
        });

        return user;
    }


    //Mario
    getUserRoles = async(id) => { // CAMBIAR ROLESABILTIES.
        this.sequelize.conectar();

        const user = await models.User.findByPk(id, {include: 'RolUser'});
        
        this.sequelize.desconectar();
        return user;
    }


    //Mario
    userExiste = async(id) => {

        const resp = await models.User.count({where: {id: id}});

        if (resp != 0) return true;
        else return false
    }


    //Mario
    getUserCitas = async(id) => {
        const user = await models.User.findByPk(id, {include: ['citasPendientes', 'citasPasadas']});

        user.dataValues.citas = getArrayCitas(user);

        return user.dataValues;
    }


    //Mario
    getUserLogin = async(email, passwd) => {
        const id = await this.getIdEmail(email);

        const user = await models.User.findOne({
            attributes: ['id', 'nombre', 'codSeguridad'],
            where : {
                id: id.id,
                passwd: passwd
            },

            include: 'RolUser'
        });
        console.log('pruieba')
        return user.dataValues;
    }


    getUserCambiarPasswd = async(id, passwd) => {
        const user = await models.User.findOne({
            attributes: ['id', 'passwd'],
            where: {
                id: id,
                passwd: passwd
            }
        });

        return user;
    }


    getUserInfo = async(id) => {
        const user = await models.User.findByPk(id, {
            attributes: ['id', 'nombre', 'gSanguineo', 'dni', 'nDonante', ]
        });

        return user;
    }


    //Mario
    getAbilities = async(roles) =>  {
        try {
            this.sequelize.conectar();

            const rolesAbilities = await models.Rol.findAll({
                attributes: ['abilities'],
                where: {
                    id: {
                        [Op.in]: roles
                    }
                }
            });

            return rolesAbilities;
        }
        catch (err) {
            throw err;
        }
    }
    

    //Alicia
    getSuscritosNewsletter = async() => {
        try {
            this.sequelize.conectar();

            const emails = await models.Email.findAll({
                attributes: ['id', 'email', 'newsletterVerifiedAt', 'vKeyNewsletter'],
                where: {
                    newsletterVerifiedAt: {
                        [Op.ne]: null
                    }
                }
            });

            this.sequelize.desconectar();
            return emails;
        }
        catch (err) {
            throw err;
        }
    }


    //Mario
    insertUser = async(id, nombre, passwd = null) => { 

        try {
            const resp = await models.User.create({
                id: id,
                nombre: nombre,
                passwd: passwd,
                codSeguridad: '1234',
                bloqueado:0,
                notificacion:1
            });

            const resp1 = await models.RolUser.create({
                idRol: 2,
                idUser: resp.id
            });

            return resp.dataValues;
        }
        catch (err) {
            throw err;
        }
    }


    userExiste = async(id) => {

        const resp = await models.User.count({where: {id: id}});

        if (resp != 0) return true;
        else return false
    }


    //Mario
    insertEmail = async(vKey, email) => {
        this.sequelize.conectar();

        let resp = null;
        resp = await models.Email.findOne({
            attributes: ['id', 'emailVerifiedAt'],
            where: {
                email: email,
            }
        });

        if (resp == null) {
            resp = await models.Email.create({
                email: email,
                vKeyEmail: 'vKey',
                emailVerifiedAt:Date.now()
            });
        }
        else if (resp.dataValues.emailVerifiedAt != null){
            throw Error('usuario ya registrado');
        }
        
        return resp.dataValues;
    }


    //Alicia
    insertEmailNewsletter = async(vKey, email) => { 
        this.sequelize.conectar();
        
        try {
            
            const resp = await models.Email.create({
                email: email,
                vKeyNewsletter: vKey
            });
            
            this.sequelize.desconectar();
            
            return resp;
        }
        catch (err) {
            throw err;
        }
    }


    //Mario
    updateVerificacionEmail = async(id, vKey) => {  
        let resp = null;

        try {
            let email = await models.Email.findByPk(id);

            if (email.vKeyEmail == vKey) {
                
                resp = await email.update({emailVerifiedAt: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')});
            }

            this.sequelize.desconectar();
            return resp;
        }
        catch (err) {
            throw err;
        }
    }


    //Alicia
    updateVerificacionEmailNewsletter = async(id, vKey) => {
        let resp = null;

        try {
            this.sequelize.conectar();
            let email = await models.Email.findByPk(id);

            if(email.vKeyNewsletter == vKey) {
                
                resp = await email.update({ newsletterVerifiedAt: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss') });
            }

            this.sequelize.desconectar();
            return resp;
        }
        catch (err) {
            throw err;
        }
    }


    //Alicia
    updateCancelarNewsletter = async(id) => {
        try {
            this.sequelize.conectar();
            let email = await models.Email.findByPk(id);

            const resp = await email.update({newsletterVerifiedAt: null});

            this.sequelize.desconectar();
            return resp;
        }
        catch (err) {
            throw err;
        }
    }


    //Alicia 
    updateVKeyNewsletterEmail = async(vKey, id) => {
        try {
            this.sequelize.conectar();
            let email = await models.Email.findByPk(id);

            const resp = await email.update({ vKeyNewsletter: vKey });

            this.sequelize.desconectar();
            return resp;
        }
        catch (err) {
            throw err;
        }
    }

        
    //Mario
    updateUserPasswd = async(id, nuevaPasswd) => {

        let user = await models.User.findByPk(id);
        user.update({passwd: nuevaPasswd});
        user.passwd = nuevaPasswd;

        const resp = await user.save();

        return resp.dataValues;
    }


    //Mario
    updateUserAdmin = async(id, datosUser) => {
        let user = await models.User.findByPk(id);
        let updateUser = {};

        user.gSanguineo = datosUser.gSanguineo;
        user.nDonante = datosUser.nDonante;

        const resp = await user.save();

        return resp;
    }

    updateUserPerfil = async(id, datosUser) => {
        let user = await models.User.findByPk(id);

        user.dni = datosUser.dni;
        user.nombre = datosUser.nombre;

        const resp = await user.save();

        return resp;
    }

    //Mario
    updateCodRecPasswd = async(id, cod) => {
        let user = await models.User.findByPk(id);
        user.codRecPasswd = cod;

        const resp = await user.save();

        this.sequelize.desconectar();
        return {resp: resp.dataValues, user: user.dataValues};
    }

    //Alejandro
    getCantidadNotificaciones = async(idUser) => {
        let user = await models.User.findByPk(idUser);

        return user.notificacion;
    }

    //Alejandro
    getAdministradores = async() => {

        this.sequelize.conectar();
        let resultado = [];
        try {
            resultado = await models.User.findAll({
                include: [
                    {
                        model: models.RolUser,
                        attributes: ['idUser', 'idRol'],
                        as: 'RolUser',
                        where: { idRol: 1}
                    }
                ],
                attributes: ['id', 'nombre']
            });
            this.sequelize.desconectar();
        } catch(error) {
            this.sequelize.desconectar();
            throw error;
        }
        return resultado;
        
    }

    //Alejandro
    getEmailsAdministradores = async() => {

        this.sequelize.conectar();
        let resultado = [];
        try {
            resultado = await models.Email.findAll({
                include: [
                    {
                        model: models.RolUser,
                        attributes: ['idUser', 'idRol'],
                        as: 'RolUser',
                        where: { idRol: 1}
                    }
                ],
                attributes: ['id', 'email']
            });
            this.sequelize.desconectar();
        } catch(error) {
            this.sequelize.desconectar();
            throw error;
        }
        return resultado;
        
    }

    getNotificacionUser = async(id) => {
        this.sequelize.conectar();
        let resultado = [];
        try {
            resultado = await models.User.findAll({
                attributes: ['id', 'nombre','notificaciones'],
                where:{id: id}
            });
            this.sequelize.desconectar();
        } catch(error) {
            this.sequelize.desconectar();
            throw error;
        }
        return resultado;
    }

    //Alejandro
    aumentarNotificacionAdministrador = async() => {
        this.sequelize.conectar();
        let resp = [];
        try {
            const administradores = await models.User.findAll({
                include: [
                    {
                        model: models.RolUser,
                        attributes: ['idUser', 'idRol'],
                        as: 'RolUser',
                        where: { idRol: 1}
                    }
                ],
                attributes: ['id', 'nombre', 'notificacion']
            });
            administradores.forEach(administrador => {
                let sum = administrador.notificacion + 1;
                resp += administrador.update({notificacion: sum});
            });
            
            this.sequelize.desconectar();
        } catch(error) {
            this.sequelize.desconectar();
            throw error;
        }
        return resp;
    }

    //Alejandro
    disminuirNotificacionAdministrador = async() => {
        this.sequelize.conectar();
        let resp = [];
        try {
            const administradores = await models.User.findAll({
                include: [
                    {
                        model: models.RolUser,
                        attributes: ['idUser', 'idRol'],
                        as: 'RolUser',
                        where: { idRol: 1}
                    }
                ],
                attributes: ['id', 'nombre', 'notificacion']
            });
            administradores.forEach(administrador => {
                let sum = administrador.notificacion - 1;
                resp += administrador.update({notificacion: sum});
            });
            
            this.sequelize.desconectar();
        } catch(error) {
            this.sequelize.desconectar();
            throw error;
        }
        return resp;
    }

    //Alejandro
    aumentarNotificacionUsuario = async(idUser) => {
        this.sequelize.conectar();
        let user = await models.User.findByPk(idUser);
        let sum = user.notificacion + 1;
        user.update({notificacion: sum});
        this.sequelize.desconectar();
        return user;
    }

    //Alejandro
    disminuirNotificacionUsuario = async(idUser) => {
        this.sequelize.conectar();
        let user = await models.User.findByPk(idUser);
        let sum = user.notificacion - 1;
        if(sum < 0){
            sum = 0;
        }
        user.update({notificacion: sum});
        this.sequelize.desconectar();
        return user;
    }

    
}


    //Mario
    getCitasPendientesUser = async(id) => {
        return await models.User.findByPk(id, {include: ['citasPendientes']});
    }


    //Mario
    getCitasPasadasUser = async(id) => {
        return await models.User.findByPk(id, {include: ['citasPasadas']});
    }
    
    
const queriesUsers = new QueriesUsers();

module.exports = queriesUsers;