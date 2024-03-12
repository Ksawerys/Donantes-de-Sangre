import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PedirCitaPacienteComponent } from './pedir-cita-paciente/pedir-cita-paciente.component';
import { DatePickerComponent } from './date-picker/date-picker.component';
import { PedirCitaRoutingModule } from './citas-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MostrarCitasComponent } from './mostrar-citas/mostrar-citas.component';
import { AdministrarCitasComponent } from './administrar-citas/administrar-citas.component';
import { ModalAplazarCitaComponent } from './modal-aplazar-cita/modal-aplazar-cita.component';
import { ParamCitasComponent } from './param-citas/param-citas.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    PedirCitaPacienteComponent,
    MostrarCitasComponent,
    AdministrarCitasComponent,
    ParamCitasComponent,
  ],
  imports: [
    CommonModule,
    PedirCitaRoutingModule,
    ReactiveFormsModule,
    DatePickerComponent,
    NgbModule,
    FormsModule
  ], 
  entryComponents: [
    ModalAplazarCitaComponent
  ]
}) 
export class PedirCitaModule { }
