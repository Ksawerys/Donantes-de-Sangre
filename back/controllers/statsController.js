const { response, request } = require('express');
const queriesDonaciones = require('../database/queries/queriesDonaciones');
const queriesAltas = require('../database/queries/queriesAltas');
const moment = require('moment');

const getDonaciones = async(req, res = response) => {
    queriesDonaciones.getDonaciones()
        .then(citas => {

            const resp = {
                success: true,
                data: citas
            }

            res.status(200).json(resp);

        }).catch(err => {
            
            const resp = {
                success: false,
                msg: 'No hay registros',
            }

            res.status(203).json(resp);
        });
}



const getAltas = async(req, res = response) => {
    queriesAltas.getAltas()
        .then(altas => {

            const resp = {
                success: true,
                data: altas
            }

            res.status(200).json(resp);

        }).catch(err => {
            
            const resp = {
                success: false,
                msg: 'No hay registros',
            }

            res.status(203).json(resp);
        });
}


const insertDonacion = async(payload) => { 
    payload.fecha = moment(payload.fecha, 'YYYY-MM-DD').add(2, 'hour');
   
    const donacion = await queriesDonaciones.insertDonacion(payload);
    
    return (donacion) 
        ? { success: true, msg: 'Donación registrada con éxito', data: donacion }
        : { success: false,  msg: 'Se ha producido un error' }
}


const insertAltas = async(payload) => { 
    payload.fecha = moment(payload.fecha, 'YYYY-MM-DD').add(2, 'hour');
    const promesas = [];

    for (let i = 0; i < payload.altas; i++) {
        promesas.push(() => queriesAltas.insertAltas(payload));
    }

    try {
        const promesasResp = await Promise.all(promesas.map(p => p()));

        return {
            success: true,
            msg: 'Altas registradas con éxito',
            data: promesasResp
        }

    } catch(err) {
            
        return {
            success: false,
            msg: 'Se ha producido un error',
        }
    } 
}


module.exports = {
    getDonaciones,
    getAltas,
    insertDonacion,
    insertAltas
}