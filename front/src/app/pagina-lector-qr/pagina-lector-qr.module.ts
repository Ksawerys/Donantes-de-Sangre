import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrincipalComponent } from './principal/principal.component';
import { SharedModule } from '../shared/shared.module';
import { AppRoutingModule } from './lector-routing.module';



@NgModule({
  declarations: [
    PrincipalComponent,
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    SharedModule
  ],
  exports: [
    PrincipalComponent,
  ]
})
export class PaginaLectorQrModule { }
