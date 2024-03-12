import { Component, OnInit } from '@angular/core';
import { Direccion } from '../interfaces/direcciones.interfaces';
import { DireccionesService } from '../services/direcciones.service';

@Component({
  selector: 'app-footer-direcciones',
  templateUrl: './footer-direcciones.component.html',
  styleUrls: ['./footer-direcciones.component.scss']
})
export class FooterDireccionesComponent implements OnInit {

  dirsData: Direccion[] = [];


  constructor(private DirsService: DireccionesService) {}


  get dirPrincipal() {
    return this.dirsData[0];
  }


  ngOnInit() {
    this.DirsService.getDirecciones().subscribe(resp => {
      if (resp.success) this.dirsData = resp.data;
    });
  }
}
