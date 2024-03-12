import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainMedulaOseaComponent } from './main-medula-osea/main-medula-osea.component';
import { MedulaOseaComponent } from './medula-osea/medula-osea.component';
import { DondeMedulaOseaComponent } from './donde-medula-osea/donde-medula-osea.component';



const routes: Routes = [
  {
    path: '',
    component: MainMedulaOseaComponent,
    children: [
      { path: 'donaMedulaOsea', component: MedulaOseaComponent },
      { path: 'mapaOsea', component: DondeMedulaOseaComponent },
      { path: '**', redirectTo: 'medula-osea' }
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class DonacionMedulaRoutingModule { }
