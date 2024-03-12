const sequelize = require('../ConexionSequelize');
const models = require('../../models/index.js');
const moment = require('moment');

class QueriesQr {
    constructor() {
        this.sequelize = sequelize;
    }
    
 getUltimaCita = async(id) => {
    let data="";
    let hora="";
    try {
        let cita = await models.Cita.findByPk(id, {include: ['user']});
        let fechaDb = new Date(cita.dataValues.fecha);
        fechaDb.setHours(fechaDb.getHours() + 2);
        let f=cita.dataValues.fecha;
        if (!fechaDb.getTime() === f.getTime()) {
            hora = moment(cita.dataValues.fecha, 'HH:mm').subtract(2, 'hour').format('HH:mm');
        } else {
            hora = moment(cita.dataValues.fecha, 'HH:mm').format('HH:mm');
        }
        
        let fecha = moment(cita.dataValues.fecha, 'YYYY-MM-DD').format('DD-MM-YYYY');
        
        data = {
            "nombre":cita['user'].dataValues.nombre,
            "donacion":cita.dataValues.donacion,
            "fecha":fecha,
            "hora": hora,
            "cancelada":cita.dataValues.cancelada
        }
    } catch (err) {
        throw err;
    }

    return data;
}
}



const queriesQr = new QueriesQr();
module.exports = queriesQr;