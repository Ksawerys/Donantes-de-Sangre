import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { AddImagenComponent } from './add-imagen/add-imagen.component';


@NgModule({
  declarations: [
    AddImagenComponent
  ],
  imports: [
    CommonModule,
    NgxPaginationModule
  ],
  exports: [ 
    AddImagenComponent
  ]
})
export class GaleriaModule { }
