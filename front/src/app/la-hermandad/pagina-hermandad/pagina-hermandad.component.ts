import { Component, OnInit } from '@angular/core';
import { LaHermandadService } from '../services/la-hermandad.service';
import { Historia, Integrante } from '../interfaces/la-hermandad.interface';

@Component({
  selector: 'app-pagina-hermandad',
  templateUrl: './pagina-hermandad.component.html',
  styleUrls: ['./pagina-hermandad.component.scss']
})
export class PaginaHermandadComponent implements OnInit {

  junta: Integrante[] = [];
  historia: Historia = { id: -1, nombre: 'historia', valor: ''};

  constructor(private hermandadService: LaHermandadService) { }

  //Alicia
  ngOnInit() {
    this.hermandadService.getIntegrantesCargo()
      .subscribe(resp => {
        if (resp.success) {
          this.junta = resp.data;
        }
      });

    this.hermandadService.getHistoria()
      .subscribe(resp => {
        if (resp.success) {
          this.historia = resp.data;
        }
      });
  }
}
