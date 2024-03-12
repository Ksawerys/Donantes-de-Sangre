import { Component, OnInit } from '@angular/core';
import { Direccion } from '../interfaces/direcciones.interfaces';
import { DireccionesService } from '../services/direcciones.service';

@Component({
  selector: 'app-inicio-direcciones',
  templateUrl: './inicio-direcciones.component.html',
  styleUrls: ['./inicio-direcciones.component.scss']
})
export class InicioDireccionesComponent implements OnInit {

  dirsData: Direccion[] = [];


  constructor(private DirsService: DireccionesService) {}


  ngOnInit() {
    this.DirsService.getDirecciones().subscribe(resp => {
      if (resp.success) this.dirsData = resp.data;
    });
  }
}
