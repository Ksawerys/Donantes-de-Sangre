import { Component } from '@angular/core';
import { entradaSalidaVentana } from '../../animaciones/animaciones';

@Component({
  selector: 'app-newsletter-ventana',
  templateUrl: './newsletter-ventana.component.html',
  styleUrls: ['./newsletter-ventana.component.scss'],
  animations: [ entradaSalidaVentana ]
})
//Alicia
export class NewsletterVentanaComponent {

  mostrar: boolean = true;
  suscrito: boolean = false;
  titulo: string = '¡No te pierdas nada!';
  texto: string = 'Suscríbete a nuestra newsletter para estar al tanto de noticias y eventos.';

  //Alicia
  cerrar() {
    this.mostrar = false;
  }

  //Alicia
  cambiarMensaje(event: boolean) {
    this.suscrito = true;

    this.titulo = '¡Gracias por apuntarte!';
    this.texto = 'Hemos enviado un enlace de verificación a tu correo ¡No olvides visitarlo para empezar a recibir notificaciones!';

    setTimeout(() => this.cerrar(), 5000);
  }
}
