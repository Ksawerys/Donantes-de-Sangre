import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HorariosRoutingModule } from './horarios-routing.module';
import { HorariosConfigComponent } from './horarios-config/horarios-config.component';
import { InicioHorariosComponent } from './inicio-horarios/inicio-horarios.component';

@NgModule({
  declarations: [
    HorariosConfigComponent,
    InicioHorariosComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    HorariosRoutingModule
  ],
  exports: [
    InicioHorariosComponent
  ]
})
export class HorariosModule { }
