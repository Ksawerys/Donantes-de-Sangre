import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrincipalComponent } from './principal/principal.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: ':idU/:idC',
    component: PrincipalComponent,
    children: [
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
