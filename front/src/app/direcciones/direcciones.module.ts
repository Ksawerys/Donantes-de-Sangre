import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DireccionesRoutingModule } from './direcciones-routing.module';
import { DireccionesConfigComponent } from './config-direcciones/config-direcciones.component';
import { FooterDireccionesComponent } from './footer-direcciones/footer-direcciones.component';
import { InicioDireccionesComponent } from './inicio-direcciones/inicio-direcciones.component';
import { SafeUrlPipe } from './helpers/safe-url.pipe';

@NgModule({
  declarations: [
    DireccionesConfigComponent,
    FooterDireccionesComponent,
    InicioDireccionesComponent,
    SafeUrlPipe,
  ],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    DireccionesRoutingModule
  ],
  providers: [
    SafeUrlPipe
  ],
  exports: [
    InicioDireccionesComponent,
    FooterDireccionesComponent
  ]
})
export class DireccionesModule { }
