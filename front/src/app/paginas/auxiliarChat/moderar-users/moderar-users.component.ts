import { Component, OnInit, } from '@angular/core';
import { WebSocketService } from '../../services/web-socket.service';
import { ChatService } from '../../services/chat.service';
import { Check } from '../../interfaces/paginas.interface';

@Component({
  selector: 'app-moderar-users',
  templateUrl: './moderar-users.component.html',
  styleUrls: ['./moderar-users.component.scss']
})
export class ModerarUsersComponent implements OnInit {
  p: number;
  a: number
  mensaje: number;
  aviso: number;
  valorFiltro: string
  listaBloqueados: String[];
  listaDesbloqueados: String[];
  constructor(protected socketService: WebSocketService, private ChatService: ChatService) {
    this.p = 1
    this.a = 1
    this.valorFiltro = "";
    this.listaBloqueados = [];
    this.listaDesbloqueados = [];
    this.mensaje = 0;
    this.aviso = 0;
  }
  ngOnInit() {
    this.ChatService.getListadoDesbloqueados().subscribe((resp => { this.ChatService.generarChecksDesbloqueados() }));
    this.ChatService.getListadoBloqueados().subscribe((resp => { this.ChatService.generarChecksBloqueados() }));

  }
  get Bloqueados() {
    return this.ChatService.resultBloqueados;
  }
  get Desbloqueados() {
    return this.ChatService.resultDesbloqueados;
  }
  get CheckBloqueados() {
    ;
    return this.ChatService.resultCheckBloqueados;
  }
  get CheckDesbloqueados() {
    return this.ChatService.resultCheckDesbloqueados;
  }
  Search(value: string) {
    this.valorFiltro = value;
  }
  BloquearUsuario(): void {
    if (this.listaBloqueados.length > 0) {
      this.socketService.emitEventBloquear(this.listaBloqueados).then(resp => {
        if (resp.success) {
          this.ChatService.cambiarUsersBloqueados(this.listaBloqueados);
          this.socketService.emitEventLista('lista');
          this.aviso = 1;
          setTimeout(() => this.aviso = 0, 4000);
        } else {
          this.aviso = 2;
          setTimeout(() => this.aviso = 0, 4000);
        }
      });
    } else {
      this.aviso = 3;
      setTimeout(() => this.aviso = 0, 4000);
    }

  }
  DesbloquearUsuario(): void {
    if (this.listaDesbloqueados.length > 0) {
      this.socketService.emitEventDesbloquear(this.listaDesbloqueados).then(resp => {
        if (resp.success) {
          this.ChatService.cambiarUsersDesbloqueados(this.listaDesbloqueados);
          this.socketService.emitEventLista('lista');
          this.mensaje = 1;
          setTimeout(() => this.mensaje = 0, 4000);
        } else {
          this.mensaje = 2;
          setTimeout(() => this.mensaje = 0, 4000);
        }
      });
    } else {
      this.mensaje = 3;
      setTimeout(() => this.mensaje = 0, 4000);
    }
  }

  limpiarModal(modal: String) {
    if (modal == "desbloqueado") {
      this.ChatService.desmarcarCheckSeleccionados(1);
      this.listaDesbloqueados = [];
    } else if (modal == "bloqueado") {
      this.ChatService.desmarcarCheckSeleccionados(2);
      this.listaBloqueados = [];
    }
  }
  UserSeleccionado(event: any, modal: String): void {
    if (modal == "bloqueado") {
      if (event.target.checked) {
        if (!this.listaDesbloqueados.includes(event.target.id)) {
          this.listaDesbloqueados.push(event.target.id);
          this.ChatService.marcarCheck(event.target.id, 2);
        }
      }
      else {
        if (this.listaDesbloqueados.includes(event.target.id)) {
          let i = this.listaDesbloqueados.indexOf(event.target.id);
          this.listaDesbloqueados.splice(i, 1);
          this.ChatService.desmarcarCheck(event.target.id, 2);
        }
      }
    } else if (modal = "desbloqueado") {
      if (event.target.checked) {
        if (!this.listaBloqueados.includes(event.target.id)) {
          this.listaBloqueados.push(event.target.id);
          this.ChatService.marcarCheck(event.target.id, 1);
        }
      }
      else {
        if (this.listaBloqueados.includes(event.target.id)) {
          let i = this.listaBloqueados.indexOf(event.target.id);
          this.listaBloqueados.splice(i, 1);
          this.ChatService.desmarcarCheck(event.target.id, 1);
        }
      }
    }

  }


}
