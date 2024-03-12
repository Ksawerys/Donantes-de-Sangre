import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { RegistroComponent } from '../registro/registro.component';

@Component({
  selector: 'app-main-auth',
  templateUrl: './main-auth.component.html',
  styleUrls: ['./main-auth.component.scss']
})
export class MainAuthComponent implements OnInit{

  accion: string = 'login';
  registradoExito: number = -1;
  recPasswdExito: number = -1;

  constructor(private router: Router) {}

  ngOnInit(): void {
    if (this.router.url.includes('login')) {
      this.accion = 'login';
    }
    else if (this.router.url.includes('registro')) {
      this.accion = 'registro';
      this.registradoExito = -1;
    }
    else if (this.router.url.includes('recuperacionpasswd')) {
      this.accion = 'recuperacion';
    }
  }
  
  showAlertRegistro(event : number) {
    this.registradoExito = event;
  }

  showAlertRecPasswd(event: number) {
    this.recPasswdExito = event;
  }

  irAlLogin() {
    this.router.navigate(['auth/login']);
  }
}
