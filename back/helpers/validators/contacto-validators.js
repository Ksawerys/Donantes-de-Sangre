const mismaHora = (horarios = []) => {
    let repetido = false;

    for (let i = 0; i < horarios.length && !repetido; i++) {
        let horario = horarios[i];
        let hRepetida = horarios.find(h => h.id != horario.id
                                        && h.hEntrada == horario.hEntrada 
                                        && h.hSalida == horario.hSalida
                                        && h.dia == horario.dia);

        if (hRepetida) repetido = true;
    }

    if ( repetido ) throw new Error('Horario repetido');
    else return true;
}



module.exports = {
    mismaHora
}

