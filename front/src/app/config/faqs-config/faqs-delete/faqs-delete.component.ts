import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-faqs-delete',
  templateUrl: './faqs-delete.component.html',
  styleUrls: ['./faqs-delete.component.scss']
})
export class FaqsDeleteComponent {
  @Input() listaFaq: string[];
  @Output() listaFaqBorrado = new EventEmitter();
  mensaje: number;

  constructor(private ConfigService: ConfigService) {
    this.listaFaq = [];
    this.mensaje = 0;
  }
  limpiar() {
    this.mensaje = 0;
    this.ConfigService.desmarcarCheckSeleccionados();
    this.listaFaqBorrado.emit();
  }

  eliminarFaqSeleccionadas() {
    if (this.listaFaq.length > 0) {
      this.ConfigService.deleteFaqs(this.listaFaq).subscribe((res) => {
        if (res.success !== false) {
          let ids: any = [];
          res.data.map(f => ids.push(f.id));
          this.ConfigService.borradoFaqsSeleccionadas(ids);
          this.listaFaqBorrado.emit();
          this.mensaje = 2;
        } else {
          this.listaFaqBorrado.emit();
          this.mensaje = 3;
        }

      });
    } else {
      this.mensaje = 1;
    }

  }
}
