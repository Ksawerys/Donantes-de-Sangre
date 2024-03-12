import { NgForm } from '@angular/forms';
import { WebsocketService } from '../services/websocket.service';
import { LaHermandadService } from '../services/la-hermandad.service';
import { Cargo, MensajeInf } from '../interfaces/la-hermandad.interface';
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-config-cargos',
  templateUrl: './config-cargos.component.html',
  styleUrls: ['./config-cargos.component.scss']
})
export class ConfigCargosComponent implements OnInit {

  @ViewChild('closeModalCargo') closeModalCargo!: ElementRef;
  @Output() mensaje: EventEmitter<MensajeInf> = new EventEmitter<MensajeInf>();

  infoCargo!: Cargo;
  accion: string = '';
  acciones = ['añadir', 'editar', 'eliminar'];


  constructor(private hermandadService: LaHermandadService,  private socketService: WebsocketService) {
    this.limpiarCargo();
  }


  get cargosService() {
    return this.hermandadService.cargos;
  }


  ngOnInit() {
    this.hermandadService.getCargosJunta().subscribe();
  }


  insertCargo(form: NgForm) {
    this.socketService.emitEventInsertarCargo(form.value)
      .then(resp => {

        if (resp.success) this.mensaje.emit({ exito: true, msg: `Éxito al ${this.accion} el cargo`});
        else this.mensaje.emit({ exito: false, msg: `Error al ${this.accion} el cargo`});

        this.closeModalCargo.nativeElement.click();
        form.resetForm();
      });
  }


  deleteCargo(index: number) {
    const cargo = this.cargosService[index];

    if (cargo) {
      this.hermandadService.deleteCargo(cargo.id)
      .subscribe(resp => {

        if (resp.success) this.mensaje.emit({ exito: true, msg: `Éxito al ${this.accion} el cargo`});
        else this.mensaje.emit({ exito: false, msg: `Error al ${this.accion} el cargo`});
      });
    }
  }


  limpiarCargo() {
    this.infoCargo = { id: -1, nombre: '' };
  }
}
