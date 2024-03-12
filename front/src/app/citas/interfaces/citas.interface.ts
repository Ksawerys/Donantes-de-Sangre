export interface CitasReservadasHorasResponse {
    sucess: boolean;
    fecha: string;
    hora: string;
}


export interface HorarioCitasResponse {
    success: boolean;
    horas: string[];
}


export interface SuccessMsgResponse {
    success: boolean;
    msg: string;
}


export interface Cita {
    id: string;
    fecha: string;
    donacion: string;
    cancelada: boolean;
}


export interface CitaAdmin {
    id: string;
    fecha: string;
    donacion: string;
    cancelada: boolean;
    haDonado: number;
    user : {
        id: string;
        nombre: string;
    }
}


export interface FetchCitasResponse {
    success: boolean;
    citas: Cita[];
    msg: string;
}


export interface FetchCitasAdminResponse {
    success: boolean;
    citas: CitaAdmin[];
    msg: string;
}


export interface CitaMostrar {
    id: string;
    dia: string;
    hora: string;
    donacion: string;
    cancelada: boolean;
}


export interface CitaAdminMostrar {
    id: string;
    dia: string;
    hora: string;
    donacion: string;
    cancelada: boolean;
    haDonado: number;
    user: {
        id: string;
        nombre: string;
    }
}


export interface CitaAdminPendienteMostrar {
    id: string;
    dia: string;
    hora: string;
    donacion: string;
    cancelada: boolean;
}


export interface CancelarCitaResponse {
    success: boolean;
    cod?: number;
    msg: string;
}


export interface getHoraCitaResponse {
    success: boolean;
    horas: Horario;
}

export interface getHorarioResponse {
    success: boolean;
    data: [];
    msg: string;
}


export interface Horario {
    [key: string]: string[];
}


export interface HorarioDia {
    codDia: string;
    hEntrada: string;
    hSalida: string;
}


export interface GetALaVezResponse {
    success: string;
    num: number;
    msg: string;
}

//Isabel
export interface CitaInfo{
    nombre:string;
    donacion:string;
    fecha:string;
    hora:string;
    cancelada:boolean
  }
  export interface ResponseCitaInfo{
    success: boolean,
    data: CitaInfo,
    msg: string,
  }
