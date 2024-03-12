export interface TelefonosResponse { //Alicia
  success: boolean;
  msg: string,
  data: Telefono[];
}

export interface TelefonoResponse { //Alicia
  success: boolean;
  msg: string,
  data: Telefono;
}

export interface TelefonoDeleteResponse { //Alicia
  success: boolean;
  msg: string,
  data: number;
}

export interface Telefono { //Alicia
  id: number;
  numero: string;
  extension: number;
}
