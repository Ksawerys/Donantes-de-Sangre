import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminGuard } from '../auth/guards/admin.guard';
import { GraficosComponent } from './graficos/graficos.component';
import { RegistrarDatosComponent } from './registrar-datos-main/registrar-datos-main.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: GraficosComponent },
      { path: 'registrar-datos',
        component: RegistrarDatosComponent,
        canMatch: [ AdminGuard ],
        canActivate: [ AdminGuard ]
      },
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild( routes )
  ],
  exports: [
    RouterModule
  ]
})
export class StatsRoutingModule { }
