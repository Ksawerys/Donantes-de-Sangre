import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule  } from '@angular/forms';
import { ConfigRoutingModule } from './config-routing.module';
import { MainConfigComponent } from './main-config/main-config.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { SharedModule } from '../shared/shared.module';
import { HimnoConfigComponent } from './himno-config/himno-config.component';
import { AddHimnoComponent } from './auxiliarHimno/add-himno/add-himno.component';
import { EditHimnoComponent } from './auxiliarHimno/edit-himno/edit-himno.component';
import { DeleteHimnoComponent } from './auxiliarHimno/delete-himno/delete-himno.component';
import { TestConfigComponent } from './test-config/test-config.component';
import { AniadirPreguntaComponent } from './test-config/aniadir-pregunta/aniadir-pregunta.component';
import { ModificarPreguntaComponent } from './test-config/modificar-pregunta/modificar-pregunta.component';
import { BorrarPreguntaComponent } from './test-config/borrar-pregunta/borrar-pregunta.component';
import { FaqsConfigComponent } from './faqs-config/faqs-config.component';
import { FaqsAddComponent } from './faqs-config/faqs-add/faqs-add.component';
import { FaqsEditComponent } from './faqs-config/faqs-edit/faqs-edit.component';
import { FaqsDeleteComponent } from './faqs-config/faqs-delete/faqs-delete.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChatConfigComponent } from './chat-config/chat-config.component';

@NgModule({
  declarations: [
    MainConfigComponent,
    HimnoConfigComponent,
    AddHimnoComponent,
    EditHimnoComponent,
    DeleteHimnoComponent,
    TestConfigComponent,
    AniadirPreguntaComponent,
    ModificarPreguntaComponent,
    BorrarPreguntaComponent,
    FaqsConfigComponent,
    FaqsAddComponent,
    FaqsEditComponent,
    FaqsDeleteComponent,
    ChatConfigComponent
  ],
  imports: [
    NgbModule,
    FormsModule,
    CommonModule,
    SharedModule,
    ConfigRoutingModule,
    ReactiveFormsModule,
    AngularEditorModule,
  ],
  exports: [
    MainConfigComponent
  ]
})
export class ConfigModule { }
