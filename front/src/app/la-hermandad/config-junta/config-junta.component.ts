import { NgForm } from '@angular/forms';
import { WebsocketService } from '../services/websocket.service';
import { LaHermandadService } from '../services/la-hermandad.service';
import { Cargo, Integrante, MensajeInf } from '../interfaces/la-hermandad.interface';
import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-config-junta',
  templateUrl: './config-junta.component.html',
  styleUrls: ['./config-junta.component.scss']
})
export class ConfigJuntaComponent {

  @ViewChild('closeModalInt') closeModalInt!: ElementRef;
  @Output() mensaje: EventEmitter<MensajeInf> = new EventEmitter<MensajeInf>();

  infoInt!: Integrante;
  junta: Integrante[] = [];
  accion: string = '';
  acciones = ['añadir', 'editar', 'eliminar'];


  constructor(private hermandadService: LaHermandadService, private socketService: WebsocketService) {
    this.limpiarIntegrante();
  }


  get cargosService() {
    return this.hermandadService.cargos;
  }


  ngOnInit() {
    this.hermandadService.getIntegrantesCargo()
      .subscribe(resp => {
        if (resp.success) this.junta = resp.data;
      });
  }


  setInfoIntegrante(index: number) {
    const integrante = this.junta[index];

    this.infoInt = {
      id: integrante.id,
      nombre: integrante.nombre,
      cargo: integrante.cargo,
      idCargo: integrante.idCargo
    }
  }


  insertOrUpdateIntegranteJunta(form: NgForm) {

    const idCargo = this.cargosService.find(c => c.nombre == this.infoInt.cargo);
    if (idCargo) this.infoInt.idCargo = idCargo.id;

    this.hermandadService.insertOrUpdateIntegranteJunta(this.infoInt)
      .subscribe(resp => {

        if (resp.success) {

          this.infoInt = resp.data;
          const indexInt = this.junta.findIndex(i => i.id == this.infoInt.id);

          if (indexInt == -1) this.junta.push(this.infoInt);
          else this.junta[indexInt] = this.infoInt;

          this.mensaje.emit({ exito: true, msg: `Éxito al ${this.accion} el integrante`});

        } else this.mensaje.emit({ exito: false, msg: `Error al ${this.accion} el integrante`});

        this.closeModalInt.nativeElement.click();
        form.resetForm();
      })
  }


  deleteIntegrante(index: number) {
    const int = this.junta[index];

    if (int) {
      this.hermandadService.deleteIntegranteJunta(int.id)
      .subscribe(resp => {

        if (resp.success) {
          this.junta.splice(this.junta.findIndex(i => i.id == resp.data), 1);
          this.mensaje.emit({ exito: true, msg: `Éxito al ${this.accion} el integrante`});

        } else this.mensaje.emit({ exito: false, msg: `Error al ${this.accion} el integrante`});

      });
    }
  }


  limpiarIntegrante() {
    this.infoInt = { id: -1, nombre: '', cargo: '', idCargo: -1 };
  }
}
