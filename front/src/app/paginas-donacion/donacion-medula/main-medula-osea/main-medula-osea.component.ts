import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-medula-osea',
  templateUrl: './main-medula-osea.component.html',
  styleUrls: ['./main-medula-osea.component.scss']
})
export class MainMedulaOseaComponent {
  public elementos = [
    {
      nombre : "La médula ósea",
      icono: "fa-solid fa-bone",
      enlace: "donaMedulaOsea"
    },
    {
      nombre : "¿Dónde donar?",
      icono: "fa-solid fa-map-location-dot",
      enlace: "mapaOsea"
    }
  ];

  public elementoActivo = this.elementos.map(e => e.enlace).indexOf(this.router.url.split('/').pop()!);


  constructor(private router: Router) { }
}
