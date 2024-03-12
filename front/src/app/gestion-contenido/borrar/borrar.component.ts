//Todo Isa
import { Component, Input } from '@angular/core';
import { ContenidoService } from '../contenido.service';
@Component({
  selector: 'app-borrar',
  templateUrl: './borrar.component.html',
  styleUrls: ['./borrar.component.scss']
})
export class BorrarComponent {

  @Input() idBorrado: string;
  mensaje: number;
  constructor(private ContenidoService: ContenidoService) {
    this.mensaje = 0;
    this.idBorrado = "";
  }


  limpiarIdBorrado() {
    this.idBorrado = "";
  }


  limpiarMensaje() {
    this.mensaje = 0;
  }


  borradoNoticia() {
    this.ContenidoService.borrarNoticia(this.idBorrado).subscribe(
      {
        next: data => {
          if (data.success !== false) {
            this.ContenidoService.borrar(this.idBorrado);
            this.mensaje = 1
          }
        },
        error: error => {
          this.mensaje = 2;
        }
      });
  }
}
