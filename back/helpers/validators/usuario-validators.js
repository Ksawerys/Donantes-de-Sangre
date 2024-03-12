const dniValido = (dni) => {
    let numero
    let letr
    let letra
    let expresion_regular_dni
    let valido = false;
   
    expresion_regular_dni = /^\d{8}[a-zA-Z]$/;
   
    if (expresion_regular_dni.test(dni)){
        numero = dni.substr(0,dni.length-1);
        letr = dni.substr(dni.length-1,1);
        numero = numero % 23;
        letra='TRWAGMYFPDXBNJZSQVHLCKET';
        letra=letra.substring(numero,numero+1);
        if (letra=letr.toUpperCase()) valido = true;
    }
    else if (dni == null) valido = true;

    return valido;
}

// const nDonanteValido = (nDonante) => {
//     const regex = '';
// }

const gSanguineoValido = (gSanguineo) => {
    const regex = /^(A|B|AB|O)[+-]$/;

    return regex.test(gSanguineo) || gSanguineo == null;
}


module.exports = {
    dniValido,
    gSanguineoValido
}