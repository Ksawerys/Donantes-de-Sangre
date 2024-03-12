import { NgForm } from '@angular/forms';
import { Component } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { WebsocketService } from 'src/app/stats/services/websocket.service';

@Component({
  selector: 'app-registrar-donaciones',
  templateUrl: './registrar-donaciones.component.html',
  styleUrls: ['./registrar-donaciones.component.scss']
})
export class RegistrarDonacionesComponent {

  timer: NodeJS.Timeout | undefined;
  fecha?: NgbDateStruct;
  tiposDonacion = ['sangre', 'plasma', 'médula', 'órganos'];
  grpsSanguineos = ['A+', 'A-', 'B+', 'B-', 'B+', 'AB+', 'AB-', '0+', '0-'];
  generos = ['hombre', 'mujer'];
  registrada: boolean = false;
  tipoDonacion: string;
  gSanguineo: string;
  nDonante?: number;
  genero: string;
  mensaje: string;
  errorFecha?: boolean;


  constructor(private socketService: WebsocketService) {
    this.tipoDonacion = this.tiposDonacion[0];
    this.gSanguineo = this.grpsSanguineos[0];
    this.genero = this.generos[0];
    this.mensaje = '';
  }


  onSubmit(form: NgForm) {
    if (this.fecha) {

      const donacion = form.value;
      donacion.fecha = `${this.fecha.year}-${this.fecha.month}-${this.fecha.day}`;

      this.socketService.emitEventInsertarDonacion( donacion )
        .then(resp => {
          if (resp.success) this.registrada = true;
          else this.registrada = false;

          this.mensaje = resp.msg;
          this.errorFecha = false;
        });

      clearTimeout(this.timer);
      this.timer = setTimeout(() => this.mensaje = '', 4000);

    } else this.errorFecha = true;
  }


  setDia(fecha: NgbDateStruct) {
    this.fecha = fecha;
  }
}
