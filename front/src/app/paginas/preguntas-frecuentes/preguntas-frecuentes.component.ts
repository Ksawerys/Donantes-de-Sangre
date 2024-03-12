import { Component } from '@angular/core';
import { PaginasService } from '../services/paginas.service';

@Component({
  selector: 'app-preguntas-frecuentes',
  templateUrl: './preguntas-frecuentes.component.html',
  styleUrls: ['./preguntas-frecuentes.component.scss']
})
export class PreguntasFrecuentesComponent {

  constructor(private PaginasService: PaginasService) {}

  ngOnInit() {
    this.PaginasService.getListadoFaqs().subscribe((res) => {});
  }
  get faqs() {
    return this.PaginasService.resultFaqs;
  }
}
