import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule  } from '@angular/forms';
import { DonacionMedulaRoutingModule } from './donacion-medula-routing.module';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { MainMedulaOseaComponent } from './main-medula-osea/main-medula-osea.component';
import { MedulaOseaComponent } from './medula-osea/medula-osea.component';
import { DondeMedulaOseaComponent } from './donde-medula-osea/donde-medula-osea.component';
import { TooltipModule } from 'ng2-tooltip-directive';
@NgModule({
  declarations: [
    MainMedulaOseaComponent,
    MedulaOseaComponent,
    DondeMedulaOseaComponent

  ],
  imports: [
    FormsModule,
    CommonModule,
    // SharedModule,
    DonacionMedulaRoutingModule,
    ReactiveFormsModule,
    AngularEditorModule,
    TooltipModule
  ],
  exports: [
    MainMedulaOseaComponent
  ]
})
export class DonacionMedulaModule { }
