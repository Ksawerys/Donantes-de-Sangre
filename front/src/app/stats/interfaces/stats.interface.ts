export interface DonacionMostrar {
  donacion: string,
  anio: string,
  mes: string,
  genero: string,
  gSanguineo?: string,
}

export interface Donacion {
  id: number,
  nDonante: number,
  gSanguineo: string,
  donacion: string,
  fecha: string,
  genero: string
}

export interface DonacionResponse {
  success: boolean;
  data: Donacion[];
}

export interface AltaMostrar {
  anio: string,
  mes: string
}

export interface Alta {
  id: number,
  fecha: string
}

export interface AltaResponse {
  success: boolean;
  data: Alta[];
}

export interface MsgResponseDonacion {
  success: boolean;
  msg: string;
  data: Donacion;
}


export interface MsgResponseAlta {
  success: boolean;
  msg: string;
  data: Alta[];
}
