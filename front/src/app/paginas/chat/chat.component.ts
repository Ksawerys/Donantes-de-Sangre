import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { WebSocketService } from '../services/web-socket.service';
import { ChatService } from '../services/chat.service';
import { Mensaje } from '../interfaces/paginas.interface';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ConfigService } from '../../config/services/config.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  puedeModificar: boolean = false;
  estaRegistrado: boolean = false;
  estaBloqueado: boolean = false;

  chatForm: FormGroup = new FormGroup({
    comentario: new FormControl('', [Validators.required]),
  });
  aviso: number;
  idMensaje: string;
  inicio: number = -1;
  alert: number = 0;
  men: number = 0;
  listaDes: String[] = [];
  listaBloq: String[] = [];
  @ViewChild('contenedorChat', { static: false }) contenedorChat!: ElementRef;

  constructor(protected socketService: WebSocketService, private ChatService: ChatService,
    private AuthService: AuthService, private ConfigService: ConfigService) {
    socketService.outEven.subscribe(res => {
      let m: Mensaje = {
        "idMensaje": res.idMensaje,
        "nombre": res.nombre,
        "mensaje": res.mensaje,
        "idUser": res.idUser,
        "fecha": res.fecha,
        "hora": res.hora,
      }
      ChatService.agregarMensaje(m);
      setTimeout(() => { this.contenedorChat.nativeElement.scrollTop = this.contenedorChat.nativeElement.scrollHeight; }, 50)

    });
    socketService.usuariosConectados.subscribe(res => {
      this.ChatService.setListaConectados(res);
    });
    socketService.borrarTodo.subscribe(res => {
      this.ChatService.borrarTodo();
    });
    socketService.borrarMensaje.subscribe(res => {
      this.ChatService.ActualizarListaMensajes(res);
    });
    socketService.bloqueo.subscribe(res => {
      let u = JSON.parse(localStorage.getItem('user') || "");
      if (res.includes(u.id.toString())) this.inicio = 2;
    });
    socketService.desbloqueo.subscribe(res => {
      let u = JSON.parse(localStorage.getItem('user') || "");
      if (res.data.includes(u.id.toString())) {
        this.inicio = 1;
        this.ChatService.getListadoMensajes().subscribe((res) => { });
      }

    });

    this.socketService.emitEventLista('lista');
    this.estaRegistrado = false;
    this.aviso = 0;
    this.idMensaje = "";

    const user = localStorage.getItem('user');

    if (user) {
      this.estaRegistrado = true;
      this.comprobarPuedeModificar();
    }
  }

  ngOnInit() {
    const user = localStorage.getItem('user');
    this.ConfigService.obtenerEstadoChat().subscribe((res) => {
      if (res.data == 1) {
        if (user != null) {
          this.ChatService.comprobarEstado().subscribe(resp => {
            if (resp.success) {
              this.estaBloqueado = resp.data;
              if (this.estaBloqueado) {
                this.inicio = 2;
                this.socketService.setQueryPayload(user);
                this.socketService.emitEventConectarChat(1);
              } else {
                this.socketService.setQueryPayload(user);
                this.socketService.emitEventConectarChat();
                this.ChatService.getListadoMensajes().subscribe((res) => { });
                this.inicio = 1;
              }
            } else {
              this.inicio = 4;
            }
          });
        } else {
          this.inicio = 0;
        }
      } else {
        this.inicio = 3;
      }
    })

  }

  get Conectados() {
    return this.ChatService.resultConectados;

  }
  get Mensajes() {
    return this.ChatService.resultMensajes;
  }


  cambioIdMensaje(event: any): void {
    this.idMensaje = event.target.id.slice(1);
  }
  comprobarPuedeModificar() {
    if (this.estaRegistrado) {
      this.AuthService.puedeModificar().subscribe(resp => {
        this.puedeModificar = (resp) ? true : false;
      });
    }
  }

  sendData = (event: any) => {
    if (this.chatForm.get("comentario")?.value == null) {
      this.aviso = 1;
      setTimeout(() => this.aviso = 0, 3000);
    } else if (this.chatForm.get("comentario")!.value.trim() == "") {
      this.aviso = 1;
      setTimeout(() => this.aviso = 0, 3000);
    } else {
      let datos = JSON.parse(localStorage.getItem('user') || "");
      this.socketService.emitEvent(event,
        {
          id: datos.id,
          nombreUser: datos.nombre,
          mensaje: this.chatForm.get("comentario")?.value
        });
      this.chatForm.reset();
      setTimeout(() => { this.contenedorChat.nativeElement.scrollTop = this.contenedorChat.nativeElement.scrollHeight; }, 50)
    }
  }
  BloquearUsuario(): void {
    this.socketService.emitEventBloquear(this.listaBloq).then(resp => {
      if (resp.success) {
        this.ChatService.cambiarUsersBloqueados(this.listaBloq);
        this.socketService.emitEventLista('lista');
        this.listaBloq = [];
        this.alert = 1;
        setTimeout(() => this.alert = 0, 4000);
      } else {
        this.alert = 2;
        setTimeout(() => this.alert = 0, 4000);
      }
    });
  }
  cambiarIdDesb(event: any) {
    this.listaDes.push(event.target.id.slice(1));
  }
  cambiarIdBloq(event: any) {
    this.listaBloq.push(event.target.id.slice(1));
  }
  DesbloquearUsuario(): void {
    this.socketService.emitEventDesbloquear(this.listaDes).then(resp => {
      if (resp.success) {
        this.ChatService.cambiarUsersDesbloqueados(this.listaDes);
        this.socketService.emitEventLista('lista');
        this.men = 1;
        setTimeout(() => this.men = 0, 4000);
      } else {
        this.men = 2;
        setTimeout(() => this.men = 0, 4000);
      }
    });
  }
}
