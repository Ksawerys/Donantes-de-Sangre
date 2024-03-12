const sequelize = require('../ConexionSequelize');
const conexion = require('../Conexion');
const moment = require('moment');
const {Op, DATE, Sequelize} = require('sequelize');
const models = require('../../models/index.js');
// const metodosFecha = require('../../helpers/fechas');

// todo Mario

const getDataValues = (citas) => {
    citas.forEach(cita => {
        cita = cita.dataValues;
    });

    return citas;
}


const insertCita = async(cita) => {

    const resp = await models.Cita.create({
        fecha: cita.fecha,
        userId: cita.userId,
        donacion: cita.donacion,
    });

    return resp.dataValues;
}


const getNumCitasHora = async(fecha) => {
    const n = await models.Cita.count({
        where: {fecha: fecha}
    });

    return n;
}


const getNumCitasPendientesUser = async(id) => {
    const n = await models.Cita.count({
        where: {
            userId: id,
            fecha: {
                [Op.gt]: moment().format('YYYY-MM-DD HH:mm:ss')
            },
            cancelada: {
                [Op.ne]: true
            }
        }
    });

    return n;
}


const getCitasFechaHora = async(fecha) => {
    try {
        
        const citas = await conexion.query('SELECT citas.fecha FROM citas '
            + 'JOIN users ON citas.userId = users.id '
            + 'WHERE DATE(citas.fecha) = ?;', fecha
        );

        citas.forEach(cita => {
            cita.hora = moment(cita.fecha).format('HH:mm');
        });
    
        return citas;
    }
    catch (err) {
        return [];
    }
}

const getHorarioCitas = async() => {
    let diasHoras = {l: [], m: [], x: [], j: [], v: [], s:[], d:[]};
    const horas = await conexion.query('SELECT diasHoras.hora, diasHoras.codDia FROM diasHoras');

    Object.keys(diasHoras).forEach(key => {
        horas.forEach(hora => {
            if (hora.codDia == key) {
                diasHoras[key].push(hora.hora);
            }
        });
    })
    
    return diasHoras;
}


const getHoraCitaDia = async(codDia) => {

    const horas = await models.DiaHora.findAll({
        attributes: ['hora'],
        where: {
            codDia: codDia
        }
    });

    return horas;
}


// const getHorarioCitas = async(dia) => {

//     const fecha = new Date(dia);
//     let codDia = '';

//     switch (fecha.getDay()) {
//         case 1:
            
//             codDia = 'l';
//             break;
    
//         case 2:
            
//             codDia = 'm';
//             break;
        
//         case 3:
            
//             codDia = 'x';
//             break;

//         case 4:
            
//             codDia = 'j';
//             break;

//         case 5:
            
//             codDia = 'v';
//             break;

//         case 6:
            
//             codDia = 's';
//             break;
//     }

//     const horas = await conexion.query('SELECT diasHoras.hora FROM diasHoras '
//         + 'JOIN horarios ON horarios.codDia = diasHoras.codDia '
//         + 'WHERE horarios.codDia LIKE ' + "'" + codDia + "'");
    
//     let arrayHoras = [];
//     horas.forEach(hora => {
//         arrayHoras.push(hora.hora);

//     });

//     return arrayHoras;
// }


const getCitaPendienteUser = async(id) => {
    const citasUser = await models.Cita.findAll({
        attributes: ['id', 'fecha', 'donacion', 'cancelada'],
        where: {
            userId: id,
            fecha: {
                [Op.gt]: moment().format('YYYY-MM-DD HH:mm:ss')
            }
        },

        order: [['cancelada', 'ASC'], ['fecha', 'DESC']]
    });


    return (citasUser != null) ? citasUser : null;
}


const getCitasPasadasUser = async(id) => {
    const citasUser = await models.Cita.findAll({
        attributes: ['id', 'fecha', 'donacion', 'cancelada', 'haDonado'],
        where: {
            userId: id,
            fecha: {
                [Op.lte]: moment().format('YYYY-MM-DD HH:mm:ss')
            }
        },

        order: [['fecha', 'DESC']]
    });

    return (citasUser != null) ? citasUser : null;
}

const getCitasPendientes = async() => {
    return await models.Cita.findAll({
        attributes: ['id', 'fecha', 'donacion', 'cancelada'],
        where: {
            fecha: {
                [Op.gt]: moment().format('YYYY-MM-DD HH:mm:ss')
            }
        },
        include: ['user'],
        order: [['cancelada', 'ASC'], ['fecha', 'DESC']]
    }); 
}


const getCitasPendientesRec = async() => {
    const citas = await conexion.query('SELECT citas.id, citas.fecha, citas.donacion, emails.id as userId, emails.email FROM citas '
        + 'JOIN emails on citas.userId = emails.id WHERE citas.cancelada <> 1 '
        + 'AND fecha > DATE(NOW())'
    );

    return citas;
}


const getCitasPasadas = async() => {
    return await models.Cita.findAll({
        attributes: ['id', 'fecha', 'donacion', 'cancelada', 'haDonado'],
        where: {
            fecha: {
                [Op.lte]: moment().format('YYYY-MM-DD HH:mm:ss')
            }
        },
        include: ['user'],
        order: [['fecha', 'DESC']]
    });
}


// const getCitas = async() => {
//     return await models.Cita.findAll({
//         attributes: ['id', 'fecha', 'donacion', 'cancelada', 'asistida'],
//         where: {
//             fecha: {
//                 [Op.lte]: moment().format('YYYY-MM-DD HH:mm:ss')
//             }
//         },
//         include: ['user'],
//         order: [['fecha', 'DESC']]
//     });
// }


// TODO: hacer middleware comproando que la cita sea del usuario que la cancela
const cancelarCita = async(idCita) => {
    let cita = await models.Cita.findByPk(idCita, {
        include: ['user']
    });

    cita.update({cancelada: true});

    const resp = cita.save();

    return resp;
}


const updateFechaCitaPendiente = async(id, fecha) => {
    let cita = await models.Cita.findByPk(id, {include: ['user']});
    

    cita.fecha = fecha;
    cita.update({fecha: fecha});

    const resp = cita.save();

    return resp;
}


const updateCitaPasadaHaDonado = async(id, haDonado) => {
    let cita = await models.Cita.findByPk(id);

    cita.update({haDonado: haDonado});

    const resp = cita.save();

    return resp;
}


const updateNumPersonasCita = async(nPersonas) => {
    let param = await models.ParametrosGenerales.findByPk(1);

    param.update({valor: nPersonas});

    const resp = param.save();

    return resp;
}


const insertHoraCita = async(codDia, hora) => {
    const resp = models.DiaHora.create({
        codDia: codDia,
        hora: hora
    });

    return resp;
}


const deleteHoraCita = async(hora) => {
    const resp = await models.DiaHora.destroy({
        where: {hora: hora}
    });

    return resp;
}


const getHorarioDia = async(codDia) => {
    const resp = await models.Horario.findAll({
        attributes: ['hEntrada', 'hSalida'],
        where: {codDia: codDia}
    });

    return resp;
}



const getHorarios = async() => {
    const resp = await models.Horario.findAll({
        attributes: ['codDia', 'hEntrada', 'hSalida']
    });

    return resp;
}


const getNumPersCita = async() => {
    const resp = await models.ParametrosGenerales.findByPk(1);

    return resp.dataValues.valor;
}



module.exports = {
    getCitasFechaHora,
    getHorarioCitas,
    getHoraCitaDia,
    getNumCitasHora,
    getNumCitasPendientesUser,
    getCitaPendienteUser,
    getCitasPasadasUser,
    getCitasPasadas,
    getCitasPendientes,
    getCitasPendientesRec,
    insertCita,
    cancelarCita,
    updateFechaCitaPendiente,
    updateCitaPasadaHaDonado,
    updateNumPersonasCita,
    insertHoraCita,
    deleteHoraCita,
    getHorarioDia,
    getHorarios,
    getNumPersCita,
};