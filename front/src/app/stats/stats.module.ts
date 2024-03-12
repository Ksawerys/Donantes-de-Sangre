import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StatsRoutingModule } from './stats-routing.module';
import { GraficosComponent } from './graficos/graficos.component';
import { RegistrarDatosComponent } from './registrar-datos-main/registrar-datos-main.component';
import { RegistrarDonacionesComponent } from './registrar-donaciones/registrar-donaciones.component';
import { RegistrarAltasComponent } from './registrar-altas/registrar-altas.component';
import { CalendarioComponent } from './calendario/calendario.component';

@NgModule({
  declarations: [
    GraficosComponent,
    RegistrarDatosComponent,
    RegistrarDonacionesComponent,
    RegistrarAltasComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    StatsRoutingModule,
    CalendarioComponent
  ],
  exports: [
    GraficosComponent
  ]
})
export class StatsModule { }
