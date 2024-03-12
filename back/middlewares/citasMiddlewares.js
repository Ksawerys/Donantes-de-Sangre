const queriesCitas = require('../database/queries/queriesCitas');
const metodosFecha = require('../helpers/fechas');
const {response,request} = require('express');

const hayCapacidad = async(req, res, next) => {

    const numCitas = await queriesCitas.getNumCitasHora(req.body.fecha);
    const numPersCita = await queriesCitas.getNumPersCita();

    if (numCitas < numPersCita) {next();}
    else {

        return res.status(200).json({success: false, msg: 'no hay espacio'});
    }
}


const yaHaPedidoUnaCita = async(req, res, next) => {

    const nUser = await queriesCitas.getNumCitasPendientesUser(req.body.id);
    if (nUser < 1) {next();}
    else {

        return res.status(200).json({success: false, msg: 'ya has pedido cita'});
    }
}

// NOTE: en desuso
// const fechaValida = async(req, res, next) => {

//     if (metodosFecha.horaEsMayor(req.body.fecha, moment()) 
//         && metodosFecha.horaValida(req.body.fecha)) {next();}
//     else {
//         return res.status(200).json({success: false, msg: 'fecha no válida'});
//     }
// } 


module.exports = {
    hayCapacidad,
    yaHaPedidoUnaCita,
    // fechaValida
}