const { response, request } = require('express');
const { Cita } = require('../models/Cita');
const email = require('../helpers/mail');
const queriesCitas = require('../database/queries/queriesCitas');
const fechas = require('../helpers/fechas');
const moment = require('moment');
const sequelize = require('../database/ConexionSequelize');
const queriesUsers = require('../database/queries/queriesUsers');
const metodosFecha = require('../helpers/fechas');
const { QueryInterface } = require('sequelize');
const qr = require('../helpers/qr-code');
const fs = require('fs');

// todo Mario
const pedirCita = async(req, res = response) => {
    try {

        if (metodosFecha.horaEsMayor(req.body.fecha, moment().format('YYYY-MM-DD HH:mm:ss')) 
                && metodosFecha.horaValida(req.body.fecha)) {

                    const cita = {
                        fecha: moment(req.body.fecha, 'YYYY-MM-DD HH:mm:ss').add(1, 'hour'),
                        userId: req.body.id,
                        donacion: req.body.donacion
                    }
            
                    const resp = await queriesCitas.insertCita(cita);
            
                    mandarCorreoFechaCita(cita.userId, cita.fecha, cita.donacion, resp.id);
                    
                    res.status(200).json({success: true, msg: 'cita insertada con éxito'});
            }
        else {

            res.status(200).json({success: false, msg: 'fecha no válida'});
        }
        
    }
    catch (err) {

        res.status(200).json({success: false, msg: 'se ha producido un error adsf'});
    }
}


const cancelarCita = async(req, res = response) => {
    try {
        const resp = await queriesCitas.cancelarCita(req.body.id);

        mandarCorreoCancelarCita(resp.user.id, resp.fecha);

        res.status(200).json({success: true, msg: 'cita cancelada con éxito'});
    }
    catch (err) {

        res.status(200).json({success: false, msg: 'se ha producido un error'});
    }
}


const mandarCorreoCancelarCita = async(id, fecha) => {
    const dia = moment(fecha, 'YYYY-MM-DD HH:mm:ss').format('DD-MM-YYYY');
    const hora = moment(fecha, 'YYYY-MM-DD HH:mm:ss').format('HH:mm');
    let contenido = {};

    contenido.asunto = 'Cita cancelada.';

    contenido.cuerpoHtml = `
        Tu cita del día <strong>${(metodosFecha.colocarFecha(dia))}</strong> a las 
        <strong>${(metodosFecha.colocarHora(hora))}</strong> ha sido cancelada.
    `;

    const correo = await queriesUsers.getEmailById(id);
    const resp = email.mandarCorreo(correo.email, contenido);
}


const getCitaPendienteUser = async(req, res = response) => {
    try {
        const citasUser = await queriesCitas.getCitaPendienteUser(req.params.id);

        res.status(200).json({success: true, citas: citasUser, msg:'cita devuelta con éxito'});
    }
    catch (err) {

        res.status(200).json({success: false, msg: 'se ha producido un error'});
    }
}


const getCitasPasadasUser = async(req, res = response) => {
    try {
        const citasUser = await queriesCitas.getCitasPasadasUser(req.params.id);
        
        res.status(200).json({success: true, citas: citasUser, msg:'citas devueltas con éxito'});
    }
    catch (err) {

        res.status(200).json({success: false, msg: 'se ha producido un error'});
    }
}


const getCitasPendientes = async(req, res = response) => {
    try {
        const citas = await queriesCitas.getCitasPendientes();

        limpiarUser(citas);

        res.status(200).json({success: true, citas: citas, msg:'citas devueltas con éxito'});
    }
    catch (err) {

        res.status(200).json({success: false, msg: 'se ha producido un error'});
    }
}


const getCitasPasadas = async(req, res = response) => {
    try {
        const citas = await queriesCitas.getCitasPasadas();

        limpiarUser(citas);

        res.status(200).json({success: true, citas: citas, msg:'citas devueltas con éxito'});
    }
    catch (err) {

        res.status(200).json({success: false, msg: 'se ha producido un error'});
    }
}


const getHorasDisponibles = async(req, res = response) => {

    Promise.all([queriesCitas.getHorarioCitas(req.params.fecha), queriesCitas.getCitasFechaHora(req.params.fecha)])
        .then(([horasSeg, horasReservadas]) => {

            const codDia = ['l', 'm', 'x', 'j', 'v', 's'];
            const diaSemana = new Date(req.params.fecha);
            

            let arrayHorasHorario = [];
            horasSeg[codDia[diaSemana.getDay() - 1]].forEach(horaSeg => {

                // si la hora es después que la actual y es el mismo día o si es otro día (en estos casos las horas
                // comparadas están disponibles)
                if (!moment(req.params.fecha, 'YYYY-MM-DD').isSame(moment().format('YYYY-MM-DD'))
                    || metodosFecha.horaEsMayor(moment(horaSeg, 'HH:mm:ss').format('HH:mm'), moment().format('HH:mm'))
                        && moment(req.params.fecha, 'YYYY-MM-DD').isSame(moment().format('YYYY-MM-DD'))) {
                
                            arrayHorasHorario.push(horaSeg.slice(0,5));
                }
            });

            let arrayHorasReservadas = [];
            if (horasReservadas.length > 0) {
                horasReservadas.forEach(horaRes => {
                    
                    arrayHorasReservadas.push(horaRes.hora);
                });
            }

            let horasDisponibles = [];
            for (const hora of arrayHorasHorario) {

                if (arrayHorasReservadas.filter(h => (h == hora)).length < 2) horasDisponibles.push(hora); // explicacgetcitaspendientesión justo arriba (*)
            }

            res.status(200).json({success: true, horas: horasDisponibles});
        }).catch(err => {

            res.status(200).json({success: false, msg: 'se ha producido un error'});
        });
}


const getHorasCitas = async(req, res = response) => {
    try {
        const horas = await queriesCitas.getHorarioCitas();

        res.status(200).json({success: true, horas: horas});
    }
    catch (err) {

        res.status(200).json({success: false, msg: 'se ha producido un error'});
    }
}


const userNoTieneCita = async(req, res = response) => {
    try {
        const user = await queriesCitas.getCitaPendienteUser(req.params.id);
        
        res.status(200).json({success:false, msg: 'el usuario ya tiene cita'});
    }
    catch (err) {

        res.status(200).json({success: true, msg: 'el usuario no tiene cita'});
    }
}


const hayHuecoHora = async(req, res = response) => {
    try {
        const nUsers = await queriesCitas.getNumUsersFecha(req.params.fecha);

        if (nUsers < 2) {
            res.status(200).json({success: true, msg: 'hay hueco'});
        }
        else {
            res.status(200).json({success: false, msg: 'no hay hueco'});
        }
    }
    catch (err) {

        res.status(500).json({success: false, msg: 'error del servidor'});
    }
}


const yaHaPedidoUnaCita = async(req, res = response) => {

    const nUser = await queriesCitas.getNumCitasPendientesUser(req.params.id);
    if (nUser < 1) {
        
        return res.status(200).json({success: true, msg: 'no has pedido cita'});
    }
    else {

        return res.status(200).json({success: false, msg: 'ya has pedido cita'});
    }
}


const recordarCitaTresDias = async() => {
    const citas = await queriesCitas.getCitasPendientesRec();

    const hoy = new Date();
    const tresDiasMas = new Date();
    tresDiasMas.setDate(hoy.getDate() + 3);

    let diffTime = 0;
    let diffHours = 0;6
    citas.forEach(cita => {
        const fCita = new Date(cita.fecha);

        diffTime = Math.abs(tresDiasMas - fCita);
        diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
        if (diffHours => 0 && diffHours < 24) {

            const fec = fCita.getFullYear() + '-' + fCita.getMonth() + '-' + fCita.getDate() + ' ' 
                + fCita.getHours() + ':' + fCita.getMinutes() + ':' + fCita.getSeconds()
            mandarCorreoFechaCita(cita.userId, fec, cita.donacion, cita.id);
        }
    });
}


const mandarCorreoFechaCita = async(id, fecha, donacion, idCita) => {

    const dia = moment(fecha, 'YYYY-MM-DD HH:mm:ss').format('DD-MM-YYYY');
    const hora = moment(fecha, 'YYYY-MM-DD HH:mm:ss').format('HH:mm');
    let imagenQr = await qr.generarQr(id, idCita); 
    let contenido = {};

    contenido.asunto = 'Recordatorio de tu cita.';

    contenido.cuerpoHtml = `
        Hola. Recuerda que el día <strong>${(metodosFecha.colocarFecha(dia))}</strong> a las 
        <strong>${(metodosFecha.colocarHora(hora))}</strong> tienes una cita para donar <strong>${(donacion)}</strong>.
        Se le ha adjuntado un código qr que debera mostrar cuando sea atendido para confirmar su asistencia a la cita.
    `;


    const correo = await queriesUsers.getEmailById(id);
    const resp = email.mandarCorreoAttachment(correo.email, contenido, imagenQr);

   //Elimino la imagen generada para evitar que surjan problemas de rendimiento y almacenamiento
    if (fs.existsSync(imagenQr)){
        fs.unlinkSync(imagenQr);
    }
}


const confirmarHaDonado = async(req, res = response) => {

    try {
        
        const resp = queriesCitas.updateCitaPasadaHaDonado(req.body.id, req.body.haDonado);
        res.status(201).json({success:true, msg: 'ha donado acutalizado con éxito'});
    }
    catch (err) {

        res.status(200).json({success: false, msg: 'se ha producido un error'});
    }

}


const modNumPersonaCita = async(req, res = response) => {

    try {

        const resp = await queriesCitas.updateNumPersonasCita(req.body.nPersonas);

        res.status(201).json({success: true, msg: 'parámetro actualizado con éxito'});
    }
    catch (err) {

        res.status(200).json({success: false, msg: 'se ha producido un error'});
    }
}


const getHorarios = async(req, res = response) => {
    try {
        
        const horarios = await queriesCitas.getHorarios();

        res.status(200).json({success: true, data: horarios, msg: 'devuelto con éxito'});
    }
    catch (err) {

        res.status(200).json({success: false, msg: 'se ha producido un error'}); 
    }
}


const insertHoraCita = async(req, res = response) => {
    try {

        const horario = await queriesCitas.getHorarioDia(req.body.codDia);
        let valido = false;
        const hNoRepetida = await fechas.horaCitaValida(req.body.hora, req.body.codDia);
        
        horario.forEach(h => {
            if (req.body.hora > h.hEntrada && req.body.hora < h.hSalida && hNoRepetida) {
                valido = true;
                return; // es un bucle muy sencillo. Si la hora proporcionada está entre la
                        // hora de entrada y de salida ya se puede insertar y me salgo del bucle.
            }
        });

        if (valido) {

            const resp = await queriesCitas.insertHoraCita(req.body.codDia, req.body.hora);
    
            res.status(200).json({success: true, msg: 'hora insertada con éxito'});
        }
        else {

            res.status(200).json({success: false, cod: 1, msg: 'hora no válida'});
        }
    }
    catch (err) {

        res.status(200).json({success: false, cod: 2, msg: 'se ha producido un error'});
    }
}


const deleteHoraCita = async(req, res = response) => {
    try {

        const resp = await queriesCitas.deleteHoraCita(req.params.hora);

        res.status(200).json({success: true, msg: 'hora eliminada con éxito'});
    }
    catch (err) {

        res.status(200).json({success: false, msg: 'se ha producido un error'});
    }
}


const mandarCorreoModFechaCita = async(id, fechaAnterior, fechaActual, donacion) => {

    const fechas = {
        diaAnterior: moment(fechaAnterior, 'YYYY-MM-DD HH:mm:ss').format('DD-MM-YYYY'),
        diaActual: moment(fechaActual, 'YYYY-MM-DD HH:mm:ss').format('DD-MM-YYYY'),
        horaAnterior: moment(fechaAnterior, 'YYYY-MM-DD HH:mm:ss').format('HH:mm'),
        horaActual: moment(fechaActual, 'YYYY-MM-DD HH:mm:ss').format('HH:mm')
    }
    let contenido = {};

    contenido.asunto = 'Modificiación de la fecha de tu cita.';

    contenido.cuerpoHtml = `
        Hola. Tu cita del día <strong>${(metodosFecha.colocarFecha(fechas.diaAnterior))}</strong> a las 
        <strong>${(metodosFecha.colocarHora(fechas.horaAnterior))}</strong> para donar <strong>${(donacion)}</strong>
        ha sido modificada al día <strong>${(metodosFecha.colocarFecha(fechas.diaActual))}</strong> a las 
        <strong>${(metodosFecha.colocarHora(fechas.horaActual))}</strong>.
    `;

    const correo = await queriesUsers.getEmailById(id);
    const resp = email.mandarCorreo(correo.email, contenido);
}


const limpiarUser = (citas) => {

    const filtro = ({id, nombre}) => ({id, nombre});

    citas.forEach(cita => {
        
        cita.user.dataValues = filtro(cita.user.dataValues);
    });
}


const updateFechaCita = async(req, res = response) => {

    try {

        const resp = await queriesCitas.updateFechaCitaPendiente(req.body.id, 
            moment(req.body.fechaActual, 'YYYY-MM-DD HH:mm:ss').add(2, 'hour'));
        mandarCorreoModFechaCita(resp.user.id, req.body.fechaAntigua, req.body.fechaActual, resp.donacion);

        res.status(200).json({success: true, msg: 'fecha actualizada con éxito'});
    }
    catch (err) {
        
        res.status(200).json({success: false, msg: 'se ha producido un error'});
    }
}


const getNumPersonasCita = async(req, res = response) => {

    try {

        const valor = await queriesCitas.getNumPersCita();

        res.status(200).json({success: true, num: valor, msg: 'devuelto con éxito'});
    }
    catch (err) {

        res.status(200).json({success: false, msg: 'se ha producido un error'});
    }
}


const updateNumPersonascita = async(req, res = response) => {

    try {

        const resp = await queriesCitas.updateNumPersonasCita(req.body.nCitas);

        res.status(200).json({success: true, msg: 'actualizado con éxito'});
    }
    catch (err) {

        res.status(200).json({success: false, msg: 'se ha producido un error'});
    }
}



module.exports = {
    getCitaPendienteUser,
    getCitasPasadasUser,
    getCitasPendientes,
    getCitasPasadas,
    getHorarios,
    recordarCitaTresDias,
    cancelarCita,
    pedirCita,
    // getCitasReservadas,
    // getHorarioCitas,
    hayHuecoHora,
    getHorasDisponibles,
    getHorasCitas,
    userNoTieneCita,
    yaHaPedidoUnaCita,
    confirmarHaDonado,
    updateFechaCita,
    modNumPersonaCita,
    insertHoraCita,
    deleteHoraCita,
    updateNumPersonascita,
    getNumPersonasCita
}