//Isa
import { Component, Input } from '@angular/core';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-delete-himno',
  templateUrl: './delete-himno.component.html',
  styleUrls: ['./delete-himno.component.scss']
})
export class DeleteHimnoComponent {
  @Input() idBorrar: string;
  mensaje: number;
  constructor(private ConfigService: ConfigService) {
    this.mensaje = 0;
    this.idBorrar = "";
  }

  limpiarIdBorrado() {
    this.idBorrar = "";
  }
  limpiarMensaje() {
    this.mensaje = 0;
  }
  borrarAudio() {
    this.ConfigService.borrarAudio(this.idBorrar).subscribe(
      {
        next: data => {
          if (data.success !== false) {
            this.ConfigService.borrarHimno(this.idBorrar);
            this.mensaje = 1
          }
        },
        error: error => {
          this.mensaje = 2;
        }
      });
  }
  borrarTodo() {
    this.ConfigService.borrarTodos().subscribe(
      {
        next: data => {
          if (data.success !== false) {

            this.ConfigService.borrarHimnoTodos();
            this.mensaje = 3
          }
        },
        error: error => {

          this.mensaje = 4;
        }
      });
  }
}
