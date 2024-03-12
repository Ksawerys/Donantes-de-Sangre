import { Component, OnInit } from '@angular/core';
import { Notificaciones } from './interface/notificaciones';
import { NotificacionesService } from './service/notificaciones.service';
import { AuthService } from '../auth/services/auth.service';
import { GaleriaService } from '../galeria/service/galeria.service';
@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.scss']
})
export class NotificacionesComponent implements OnInit {

  notificacionesPendienteImagenes: Notificaciones[] = [];
  puedeModificar: boolean = false;
  estaRegistrado: boolean = false;
  notificacionActual!: Notificaciones;

  constructor(private notificacionService: NotificacionesService, private galeriaService: GaleriaService, private AuthService: AuthService) {}
  ngOnInit(): void {

    if(localStorage.getItem('user') || ('')){
      const idUser = JSON.parse(localStorage.getItem('user') || ('')).id;
      this.notificacionService.mostrarNotificacionUsuario(idUser).subscribe( notificacion => {
        this.notificacionesPendienteImagenes = notificacion;
        this.notificacionActual = this.notificacionesPendienteImagenes[0];
        this.notificacionesPendienteImagenes.forEach(notificacion => {
          let f = new Date(notificacion.createdAt).toLocaleString();
          console.log(f);
          notificacion.createdAt = f;
        })
      });
    }

    const user = localStorage.getItem('user');
    if (user) {
      this.estaRegistrado = true;

      this.comprobarPuedeModificar();
    }

    this.notificacionService.comprobarPermisos.subscribe((registrado:boolean) => {
      this.estaRegistrado = registrado;

      this.comprobarPuedeModificar();
    })

  }

  comprobarPuedeModificar() {
    if (this.estaRegistrado) {
      this.AuthService.puedeModificar().subscribe((resp:boolean) => {
        this.puedeModificar = (resp) ? true : false;
      });
    }
  }


  crearModelNotificacion(notificacion: Notificaciones){
    if(notificacion.leido == false){
      notificacion.leido = true;
    }
    this.notificacionActual = notificacion;
    const formatoDatos = new FormData();
    formatoDatos.append('boleano', "" );
    this.notificacionService.notificacionLeida(this.notificacionActual.id).subscribe( msg => {
      console.log(msg);
    });

  }

  mostrarNotificaciones(): void{
    const idUser = JSON.parse(localStorage.getItem('user') || ('')).id;
    this.notificacionService.mostrarNotificacionUsuario(idUser).subscribe( notificacion => {
      this.notificacionesPendienteImagenes = notificacion;
    });
    window.location.reload();
  }

}
