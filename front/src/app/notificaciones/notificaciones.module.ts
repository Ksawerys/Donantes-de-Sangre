import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { ModalNotificacionComponent } from './modal-notificacion/modal-notificacion.component';


@NgModule({
  declarations: [
    ModalNotificacionComponent
  ],
  imports: [
    CommonModule,
    NgxPaginationModule
  ],
  exports: [
    ModalNotificacionComponent
  ]
})
export class NotificacionesModule { }
