import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainConfigComponent } from './main-config/main-config.component';
import { TestConfigComponent } from './test-config/test-config.component';
import { FaqsConfigComponent } from './faqs-config/faqs-config.component';
import { HimnoConfigComponent } from './himno-config/himno-config.component';
import { HermandadMainConfigComponent } from '../la-hermandad/config-main/config-main.component';
import { TfnosConfigComponent } from '../telefonos/config-tfnos/config-tfnos.component';
import { HorariosConfigComponent } from '../horarios/horarios-config/horarios-config.component';
import { DireccionesConfigComponent } from '../direcciones/config-direcciones/config-direcciones.component';
import { ChatConfigComponent } from './chat-config/chat-config.component';

const routes: Routes = [
  {
    path: '',
    component: MainConfigComponent,
    children: [
      { path: 'hermandad', component: HermandadMainConfigComponent },
      { path: 'telefonos', component: TfnosConfigComponent },
      { path: 'direccion', component: DireccionesConfigComponent },
      { path: 'citas', component: HorariosConfigComponent},
      { path: 'himno', component: HimnoConfigComponent }, //Isa
      { path: 'test-apto', component: TestConfigComponent},
      { path: 'faq', component: FaqsConfigComponent },
      { path: 'chat', component: ChatConfigComponent },
      { path: '**', redirectTo: 'hermandad' }
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
export class ConfigRoutingModule { }
