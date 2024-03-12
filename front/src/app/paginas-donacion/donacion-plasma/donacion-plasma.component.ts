import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-donacion-plasma',
  templateUrl: './donacion-plasma.component.html',
  styleUrls: ['./donacion-plasma.component.scss']
})
export class DonacionPlasmaComponent {

  constructor(private router: Router) { }

  irASoyApto(){
    this.router.navigate(['./aviso']);
  }
}
