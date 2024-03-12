export interface ResponseAudio {
  success: boolean,
  data: Cancion[],
  msg: string,
}
export interface ResponseModerarUser {
  success: boolean,
  data: ModerarUser[] ,
  msg: string,
}
export interface ModerarUser {
  id:string,
  nombre:string
}

export interface Cancion {
  id: string,
  nombre: string,
  titulo: string,
  letra: string,
  cancion: string,
  descarga: string
}

export interface ResponseFaqs {
  success: boolean,
  data: Faq[],
  msg: string,
}
export interface Faq {
  id: string,
  pregunta: string,
  respuesta: string,
}

export interface ResponseComentario {
  success: boolean,
  data: Mensaje,
  msg: string,
}
export interface MsgResponseBorrado{
  success: boolean,
  data: Mensaje[] ,
  msg: string,
}
export interface MsgResponseUser{
  success: boolean,
  data: ModerarUser[] ,
  msg: string,
}
export interface ResponseMensajes {
  success: boolean,
  data: Mensaje[],
  msg: string,
}
export interface Mensaje {
  idMensaje: string,
  idUser: string,
  nombre: string,
  mensaje: string
  fecha: string,
  hora: string
}
export interface ResponseListaConectados{
  success: boolean,
  data: string[],
  msg: string,
}


export interface BorrarMemResponse {
  success: boolean,
  msg: string,
  data: number
}

export interface InsertUpdateMemResponse {
  success: boolean,
  msg: string,
  data: Memoria
}

export interface GetMemResponse {
  success: boolean,
  msg: string,
  data: Memoria[]
}

export interface Memoria {
  id: number,
  anio: number,
  imagen: string,
  documento: string
}

export interface MemoriaAddUpdate {
  id: number,
  anio: number,
  imagen?: File | null,
  documento?: File | null,
  imgBorrar?: string,
  docBorrar?: string
}
export interface Check{
  id:String,
  marcado:boolean,
}
export interface ResponseEstado{
  success: boolean,
  msg: string,
  data: boolean
}

