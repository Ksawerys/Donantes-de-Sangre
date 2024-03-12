import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DonacionSangreComponent } from '../donacion-sangre/donacion-sangre.component';
import { MainPageComponent } from '../main-page/main-page.component';
import { MainMedulaOseaComponent } from '../donacion-medula/main-medula-osea/main-medula-osea.component';
import { DonacionPlasmaComponent } from '../donacion-plasma/donacion-plasma.component';
const routes: Routes = [
  {
    path: '',
    component: MainPageComponent,
    children: [
      { path: 'sangre', component: DonacionSangreComponent },
      { path: 'plasma', component: DonacionPlasmaComponent },
      {
        path: 'medula-osea',
        loadChildren: () => import('../donacion-medula/donacion-medula.module').then( m => m.DonacionMedulaModule )
      },
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
export class AppRoutingModule { }
