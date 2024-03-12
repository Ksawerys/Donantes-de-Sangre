import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AptoSangreComponent } from './apto-sangre/apto-sangre.component';
import { ResultadoComponent } from './apto-sangre/resultado/resultado.component';
import { AvisoComponent } from './apto-sangre/aviso/aviso.component';
import { AdminGuard } from './auth/guards/admin.guard';
import { AuthGuard } from './auth/guards/auth.guard';
import { GaleriaComponent } from './galeria/galeria.component';
import { AvisoLegalComponent } from './paginas/aviso-legal/aviso-legal.component';
import { TerminosUsoComponent } from './paginas/terminos-uso/terminos-uso.component';
import { PoliticasCookiesComponent } from './paginas/politicas-cookies/politicas-cookies.component';
import { UsuariosGuard } from './usuarios/guards/usuarios.guard';
import { NotificacionesComponent } from './notificaciones/notificaciones.component';


const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./paginas/paginas.module').then( m => m.PaginasModule )
  },
  {
    path: 'aviso',
    component: AvisoComponent
  },
  {
    path: 'test-apto',
    component: AptoSangreComponent
  },
  {
    path: 'resultado',
    component: ResultadoComponent
  },
  {
    path: 'galeria',
    component: GaleriaComponent
  },
  {
    path: 'donacion',
    loadChildren: () => import('./paginas-donacion/paginas-donacion.module').then( m => m.PaginasDonacionModule )
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'noticias',
    loadChildren: () => import('./gestion-contenido/gestion-contenido.module').then( m => m.GestionContenidoModule )
  },
  {
    path: 'confirmacion',
    loadChildren: () => import('./pagina-lector-qr/pagina-lector-qr.module').then( m => m.PaginaLectorQrModule)
  },
  {
    path: 'configuracion',
    loadChildren: () => import('./config/config.module').then( m => m.ConfigModule ),
    canMatch: [ AdminGuard ],
    canActivate: [ AdminGuard ]
  },
  {
    path: 'citas',
    loadChildren: () => import('./citas/citas.module').then(m => m.PedirCitaModule),
    canMatch: [ AuthGuard ],
    canActivate: [ AuthGuard ]
  },
  {
    path: 'aviso-legal',
    component: AvisoLegalComponent
  },
  {
    path: 'terminos-uso',
    component: TerminosUsoComponent
  },
  {
    path: 'politicas-cookies',
    component: PoliticasCookiesComponent
  },
  {
    path: 'notificacion',
    component: NotificacionesComponent
  },
  {
    path: 'stats',
    loadChildren: () => import('./stats/stats.module').then(m => m.StatsModule),
  },
  {
    path: 'usuarios',
    loadChildren: () => import('./usuarios/usuarios.module').then(m => m.UsuariosModule),
    canMatch: [UsuariosGuard],
    canActivate: [UsuariosGuard]
  },
  {
    path: '**',
    loadChildren: () => import('./paginas/paginas.module').then( m => m.PaginasModule )
  }

  /* ,
  {
    path: '404',
    component: ErrorPageComponent
  }*/

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
