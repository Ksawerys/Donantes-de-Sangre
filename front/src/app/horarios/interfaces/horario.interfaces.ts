import { Time } from "@angular/common";


export interface HorarioDeleteResponse { //Alicia
  success: boolean,
  msg: string,
  data: number
}

export interface Horario { //Alicia
  id: number,
  codDia: string,
  dia: string,
  hEntrada: Time,
  hSalida: Time
}

export interface HorarioResponse { //Alicia
  success: boolean,
  msg: string,
  data: Horario[]
}

export interface HorarioMostrar { //Alicia
  dias: Dia[],
  hEntrada: Time,
  hSalida: Time
}

export interface Dia { //Alicia
  id: number,
  nombre: string,
  letra: string,
  seleccionado: boolean
}

export interface Hora { //Alicia
  entrada: Time,
  salida: Time
}
