import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { MainPageContenidoComponent } from './main-page-contenido/main-page-contenido.component';
import { AddContenidoComponent } from './add-contenido/add-contenido.component';
import { NoticiasRoutingModule } from './noticias-routing.module';
import { ContenidoService } from './contenido.service';
import { SharedModule } from '../shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { BorrarComponent } from './borrar/borrar.component';
import { EditadoComponent } from './editado/editado.component';
import { AngularEditorModule } from '@kolkov/angular-editor';

@NgModule({
  declarations: [
    MainPageContenidoComponent,
    AddContenidoComponent,
    BorrarComponent,
    EditadoComponent
  ],
  imports: [
    CommonModule,
    NoticiasRoutingModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    AngularEditorModule
  ],
  providers: [
    ContenidoService
  ],
  exports: [
    AddContenidoComponent,
    MainPageContenidoComponent,
    BorrarComponent,
    EditadoComponent
  ]
})
export class GestionContenidoModule { }
