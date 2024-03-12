import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdministrarCitasComponent } from './administrar-citas/administrar-citas.component';
import { MostrarCitasComponent } from './mostrar-citas/mostrar-citas.component';
import { ParamCitasComponent } from './param-citas/param-citas.component';
import { PedirCitaPacienteComponent } from './pedir-cita-paciente/pedir-cita-paciente.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'pedircita', component: PedirCitaPacienteComponent },
      { path: 'mostrarcitas', component: MostrarCitasComponent },
      { path: 'admincitas', component: AdministrarCitasComponent },
      { path: 'paramcitas', component: ParamCitasComponent},
      { path: '**', redirectTo: 'pedircita' }
    ]
  }
];

@NgModule({
imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})

export class PedirCitaRoutingModule { }