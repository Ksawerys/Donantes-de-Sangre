import { Socket } from 'ngx-socket-io';
import { environment } from 'src/environment/environment';
import { Injectable, EventEmitter, Output } from '@angular/core';
import { CargoInsertResponse } from '../interfaces/la-hermandad.interface';
import { LaHermandadService } from './la-hermandad.service';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService extends Socket {

  @Output() insertarCargo: EventEmitter<any> = new EventEmitter();


  constructor(private hermandadService: LaHermandadService) {
    super({
      url: environment.socketUrl,
      options: { query: { payload: localStorage.getItem('user') } }
    });

    this.ioSocket.on('insertar-cargo', (res: CargoInsertResponse) => this.insertarCargo.emit(res));
  }


  emitEventInsertarCargo = (payload: FormData): Promise<CargoInsertResponse> => {
    return new Promise((resolve, reject) => {
      this.ioSocket.emit('insertar-cargo', payload, (respuesta: CargoInsertResponse) => {
        this.hermandadService.addCargo(respuesta.data);
        resolve(respuesta);
      });
    });
  }
}
