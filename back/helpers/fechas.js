const moment = require('moment');
const queriesCitas = require('../database/queries/queriesCitas');

// todo Mario

const colocarFecha = (fecha) => {
    return fecha.split('-').reverse().join('/');
}


const colocarHora = (hora) => {
    return hora.slice(0, 5);
}


// //Isabel
// const comprobarHoraFecha = (fecha,fechaDb) => {
//   return fechaDb.getTime() === fecha.getTime();
// }


const horaEsMayor = (hora, ahora) => { // copara horas con el siguiente formato HH:mm
    let esMayor = false;
    if (hora.slice(0, 2) > ahora.slice(0, 2)) {
        esMayor = true;
    }
    else if (hora.slice(0, 2) == ahora.slice(0, 2)) {
        if (hora.slice(3) > ahora.slice(3)) {
            esMayor = true;
        }
    }

    return esMayor;
}


const fechaEsMayor = (fecha, ahora) => {
    const fechaCompleta = moment(fecha, 'YYYY-MM-DD HH:mm:ss');
    
    let esMayor = false;
    if (fechaCompleta.isAfter(moment(ahora))) {
        esMayor = true;
    }

    
    return esMayor; 
}


const horaValida = async(fecha) => {
    const horasDisp = await queriesCitas.getHorarioCitas(moment(fecha, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD'));

    
    const hora = moment(fecha, 'YYYY-MM-DD HH:mm:ss').format('HH:mm:ss');
    
    const codDia = ['l', 'm', 'x', 'j', 'v', 's'];
    const diaSemana = new Date(fecha);
    
    let valida = false;
    horasDisp[codDia[diaSemana.getDay() - 1]].forEach(horaDisp => {
     
        if (horaDisp == hora) {
            valida = true;
            return; // Opto por el return porque es un bucle muy sencillo.
        }
    });

    return valida;
}


const horaCitaValida = async(hora, codDia) => {

    const horas = await queriesCitas.getHoraCitaDia(codDia);
    let valida = true;

    horas.forEach(h => {
        if (h.hora == hora) {
            valida = false;
            return
        }
    });

    return valida;
}


module.exports = {
    colocarFecha,
    colocarHora,
    horaEsMayor,
    horaValida,
    horaCitaValida
    // comprobarHoraFecha
}
