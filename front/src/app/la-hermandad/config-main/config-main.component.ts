import { Component } from '@angular/core';
import { MensajeInf } from '../interfaces/la-hermandad.interface';
import { entradaSalidaVentana } from 'src/app/shared/animaciones/animaciones';

@Component({
  selector: 'app-config-main',
  templateUrl: './config-main.component.html',
  styleUrls: ['./config-main.component.scss'],
  animations: [ entradaSalidaVentana ]
})
export class HermandadMainConfigComponent { //Alicia

  mensaje: string = '';
  exito: boolean = false;
  timer: NodeJS.Timeout | undefined;


  constructor() {}


  limpiarMensaje() {
    this.exito = false;
    this.mensaje = '';
  }


  setTimer(tiempo: number) {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.limpiarMensaje(), tiempo);
  }


  onMensaje(res: MensajeInf) {
    this.limpiarMensaje();

    this.exito = res.exito;
    this.mensaje = res.msg;

    this.setTimer(4000);
  }
}
