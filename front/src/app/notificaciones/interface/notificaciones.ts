

export interface Notificaciones {
  id: number,
  titulo: string;
  mensaje: string;
  galeriaPeticionID: number;
  idUsuarioRegistrado: number;
  idUsuarioAdministrador: number;
  leido: boolean;
  createdAt: string;
  propietario: number;
  nombreImagen:string;
  descripcionImagen:string;
  verificadoImagen:boolean;
  aceptado_rechazadoImagen:string;
  nombrePropietarioUser:string;

}
