import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { LaHermandadRoutingModule } from './la-hermandad-routing.module';
import { HermandadMainConfigComponent } from './config-main/config-main.component';
import { ConfigJuntaComponent } from './config-junta/config-junta.component';
import { ConfigHistoriaComponent } from './config-historia/config-historia.component';
import { ConfigCargosComponent } from './config-cargos/config-cargos.component';


@NgModule({
  declarations: [
    HermandadMainConfigComponent,
    ConfigJuntaComponent,
    ConfigHistoriaComponent,
    ConfigCargosComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    AngularEditorModule,
    LaHermandadRoutingModule,
  ]
})
export class LaHermandadModule { }
