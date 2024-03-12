import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { AuthRoutingModule } from './auth-routing.module';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RegistroComponent } from './registro/registro.component';
import { MainAuthComponent } from './main-auth/main-auth.component';
import { fromEvent } from 'rxjs';
import { RecuperarPasswdComponent } from './recuperar-passwd/recuperar-passwd.component';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from './material/material.module';
@NgModule({
  declarations: [
    LoginComponent,
    RegistroComponent,
    MainAuthComponent,
    RecuperarPasswdComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AuthRoutingModule,
    SharedModule,
    MaterialModule
  ]
})
export class AuthModule { }
