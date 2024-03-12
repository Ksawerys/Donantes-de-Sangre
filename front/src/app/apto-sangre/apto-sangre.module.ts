import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreguntasComponent } from './preguntas/preguntas.component';
import { ResultadoComponent } from './resultado/resultado.component';
import { AvisoComponent } from './aviso/aviso.component';

@NgModule({
  declarations: [
    PreguntasComponent,
    ResultadoComponent,
    AvisoComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    AvisoComponent,
    PreguntasComponent,
    ResultadoComponent
  ]
})
export class AptoSangreModule { }
