import { Injectable, EventEmitter, Output } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { MsgResponseAlta, MsgResponseDonacion } from 'src/app/stats/interfaces/stats.interface';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService extends Socket {

  @Output() insertarDonacion: EventEmitter<any> = new EventEmitter();
  @Output() insertarAltas: EventEmitter<any> = new EventEmitter();


  constructor() {
    super({
      url: environment.socketUrl,
      options: { query: { payload: localStorage.getItem('user') } }
    });

    this.ioSocket.on('insertar-donacion', (res: any) => this.insertarDonacion.emit(res));
    this.ioSocket.on('insertar-altas', (res: any) => this.insertarAltas.emit(res));
  }


  emitEventInsertarDonacion = (payload: FormData): Promise<MsgResponseDonacion> => {
    return new Promise((resolve, reject) => {
      this.ioSocket.emit('insertar-donacion', payload, (respuesta: MsgResponseDonacion) => {
        resolve(respuesta);
      });
    });
  }


  emitEventInsertarAltas = (payload: FormData): Promise<MsgResponseAlta> => {
    return new Promise((resolve, reject) => {
      this.ioSocket.emit('insertar-altas', payload, (respuesta: MsgResponseAlta) => {
        resolve(respuesta);
      });
    });
  }
}
