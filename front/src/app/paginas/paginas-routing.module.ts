import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { PaginaHermandadComponent } from '../la-hermandad/pagina-hermandad/pagina-hermandad.component';
import { MainPageComponent } from './main-page/main-page.component';
import { HimnoComponent } from './himno/himno.component';
import { PreguntasFrecuentesComponent } from './preguntas-frecuentes/preguntas-frecuentes.component';
import { ChatComponent } from './chat/chat.component';
import { MemoriasComponent } from './memorias/memorias.component';
const routes: Routes = [
  {
    path: '',
    component: MainPageComponent,
    children: [
      { path: '', component: InicioComponent },
      { path: 'hermandad', component: PaginaHermandadComponent },
      { path: 'himnos', component: HimnoComponent },
      { path: 'preguntas-frecuentes', component: PreguntasFrecuentesComponent },
      {
        path: 'chat-dudas', component: ChatComponent,
      },
      { path: 'memorias', component: MemoriasComponent }
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
export class PaginasRoutingModule { }
