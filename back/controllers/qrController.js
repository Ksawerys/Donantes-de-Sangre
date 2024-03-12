const { response, request } = require('express');
const queriesQr = require("../database/queries/queries-qr");

//Isa

 const getUltimaCita = async(req, res = response) => {
    queriesQr.getUltimaCita(req.params.id).then((respuesta) => {
        res.status(200).json({
           success: true,
           data: respuesta,
           msg: 'Obtenida'
        });
    }).catch((err) => {

        res.status(203).json({
           success: false,
           data: null,
           msg: 'No se ha podido obtener'
       });
    });
}
module.exports={
    getUltimaCita
}