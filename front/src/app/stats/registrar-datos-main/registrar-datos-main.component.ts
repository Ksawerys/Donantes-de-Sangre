import { Component } from '@angular/core';

@Component({
  selector: 'app-registrar-datos-main',
  templateUrl: './registrar-datos-main.component.html',
  styleUrls: ['./registrar-datos-main.component.scss']
})
export class RegistrarDatosComponent {

  elementos = [
    {
      nombre : "donaciones",
      icono: "fa-hand-holding-droplet"
    },
    {
      nombre : "altas",
      icono: "fa-user-plus"
    }
  ];
  elementoActivo = 0;


  getNombre(nombre: string) {
    return nombre.replace('-', ' ');
  }
}
