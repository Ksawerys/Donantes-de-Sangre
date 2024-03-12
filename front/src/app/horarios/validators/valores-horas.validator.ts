import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Dia, Horario } from '../interfaces/horario.interfaces';

const diaSeleccionado = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {

    const value = control.value;

    if (!value) {
      return null;
    }

    const dia = value.find((d: Dia) => d.seleccionado == true);

    return !dia ? { noDiaSelecc: true } : null;
  }
}


const mismaHora = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {

    const value = control.value;

    if (!value) {
      return null;
    }

    let esIgual: boolean = false;
    for (let i = 0; i < value.length && !esIgual; i++) {
      let horario = value[i];
      let horaRepetida = value.find((h: Horario) => h.id != horario.id && h.hEntrada == horario.hEntrada && h.hSalida == horario.hSalida);

      if (horaRepetida) esIgual = true;
    }

    return esIgual ? { mismaHora: true } : null;
  }
}


export {
  diaSeleccionado,
  mismaHora
}
