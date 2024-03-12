import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TelefonosRoutingModule } from './telefonos-routing.module';
import { InicioTfnsComponent } from './inicio-tfns/inicio-tfns.component';
import { FooterTfnosComponent } from './footer-tfnos/footer-tfnos.component';
import { TfnosConfigComponent } from './config-tfnos/config-tfnos.component';

@NgModule({
  declarations: [
    InicioTfnsComponent,
    FooterTfnosComponent,
    TfnosConfigComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    TelefonosRoutingModule
  ],
  exports: [
    InicioTfnsComponent,
    FooterTfnosComponent
  ]
})
export class TelefonosModule { }
