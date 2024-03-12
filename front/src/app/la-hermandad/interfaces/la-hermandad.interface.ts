export interface IntUpdateInsertResponse { //Alicia
  success: boolean,
  msg: string,
  data: Integrante
}

export interface IntDeleteResponse { //Alicia
  success: boolean,
  msg: string,
  data: number
}

export interface Integrante { //Alicia
  id: number,
  nombre: string,
  cargo: string,
  idCargo: number
}

export interface IntsJuntaResponse {
  success: boolean,
  msg: string,
  data: Integrante[]
}

export interface CargoDeleteResponse {
  success: boolean,
  msg: string,
  data: number
}

export interface CargoInsertResponse {
  success: boolean,
  msg: string,
  data: Cargo,
}

export interface CargosResponse { //Alicia
  success: boolean,
  data: Cargo[],
}

export interface Cargo { //Alicia
  id: number,
  nombre: string
}

export interface HistoriaResponse { //Alicia
  success: boolean,
  msg: string,
  data: Historia
}

export interface Historia { //Alicia
  id: number,
  nombre: string,
  valor: string
}

export interface MensajeInf {
  exito: boolean,
  msg: string
}
