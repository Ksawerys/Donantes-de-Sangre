import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Notificaciones } from '../interface/notificaciones';
import { GaleriaService } from 'src/app/galeria/service/galeria.service';
import { NotificacionesService } from '../service/notificaciones.service';
import { AuthService } from 'src/app/auth/services/auth.service';
@Component({
  selector: 'app-modal-notificacion',
  templateUrl: './modal-notificacion.component.html',
  styleUrls: ['./modal-notificacion.component.scss']
})
export class ModalNotificacionComponent implements OnInit {
  @Input() notificacion!: Notificaciones;
  @Output() recargarNotificaciones = new EventEmitter();

  puedeModificar: boolean = false;
  estaRegistrado: boolean = false;
  constructor(private galeriaService: GaleriaService, private notificacionService: NotificacionesService,  private AuthService: AuthService) {}

  ngOnInit(): void {
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

  aceptarFoto() {
    console.log(this.notificacion.id);
    console.log(this.notificacion);

    this.galeriaService.mandarCorreoAceptacion(this.notificacion.galeriaPeticionID).subscribe( msg => {
      console.log(msg);
    });
    this.notificacionService.postcrearNotificacionAceptarUsuario(this.notificacion).subscribe( msg => {
      console.log(msg);
    });

    this.galeriaService.aceptarPeticionFoto(this.notificacion.galeriaPeticionID).subscribe( msg => {
      console.log(msg);
    })

    this.recargarNotificaciones.emit();

  }

  rechazarFoto() {
    this.galeriaService.mandarCorreoRechazo(this.notificacion.galeriaPeticionID).subscribe( msg => {
      console.log(msg);
    })
    this.notificacionService.postcrearNotificacionRechazarUsuario(this.notificacion).subscribe( msg => {
      console.log(msg);
    })

    this.galeriaService.rechazarPeticionFoto(this.notificacion.galeriaPeticionID).subscribe( msg => {
      console.log(msg);
    })

    this.recargarNotificaciones.emit();

  }

  borrarNotificacion(){

    if(this.notificacion.aceptado_rechazadoImagen == "No se ha decidido todavia"){
      this.galeriaService.mandarCorreoRechazo(this.notificacion.galeriaPeticionID).subscribe( msg => {
        console.log(msg);
      })
      this.notificacionService.postcrearNotificacionRechazarUsuario(this.notificacion).subscribe( msg => {
        console.log(msg);
      })

      this.galeriaService.rechazarPeticionFoto(this.notificacion.galeriaPeticionID).subscribe( msg => {
        console.log(msg);
      })
    }

    this.notificacionService.deleteNotificacion(this.notificacion.id).subscribe(msg => {
      console.log(msg);
    })

    this.recargarNotificaciones.emit();
  }
}
