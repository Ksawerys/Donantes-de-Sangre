import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-donacion-sangre',
  templateUrl: './donacion-sangre.component.html',
  styleUrls: ['./donacion-sangre.component.scss']
})
export class DonacionSangreComponent {
  constructor(private router: Router) { }

  irAPedirCita(){
    this.router.navigate(['./citas/pedircita']);
  }
  irASoyApto(){
    this.router.navigate(['./aviso']);
  }
}
