import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule, Router } from '@angular/router';
import { MainPageContenidoComponent } from './main-page-contenido/main-page-contenido.component';

const routes: Routes = [
  {
    path: '',
    component: MainPageContenidoComponent,
    children: [
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
export class NoticiasRoutingModule { } 
