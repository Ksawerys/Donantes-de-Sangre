import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-error-conexion',
  templateUrl: './error-conexion.component.html',
  styleUrls: ['./error-conexion.component.scss']
})
export class ErrorConexionComponent {
  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      window.history.replaceState({}, '', this.router.url);
    });
  }
  reconnect() {
    this.router.navigate(['/']);
  }
}
