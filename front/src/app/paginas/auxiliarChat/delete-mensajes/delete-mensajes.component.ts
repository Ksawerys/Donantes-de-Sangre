import { Component,Input } from '@angular/core';
import { WebSocketService } from '../../services/web-socket.service';
import { ChatService } from '../../services/chat.service';
@Component({
  selector: 'app-delete-mensajes',
  templateUrl: './delete-mensajes.component.html',
  styleUrls: ['./delete-mensajes.component.scss']
})
export class DeleteMensajesComponent {
  aviso:number;
  @Input() idMensaje:string;
  constructor(protected socketService: WebSocketService, private ChatService: ChatService) {
    this.aviso=0;
    this.idMensaje="";
  }
  borrarTodo() {
    this.socketService.emitEventBorrarTodo().then(resp => {
      if (resp.success){
        this.ChatService.borrarTodo();
        this.aviso=1;
        setTimeout(() => this.aviso = 0, 4000);
      } else {
        this.aviso=2;
        setTimeout(() => this.aviso = 0, 4000);
      }
    });
  }
  borrarMensaje() {

    this.socketService.emitEventBorrarMensaje(this.idMensaje).then(resp => {
      if (resp.success){
        this.ChatService.ActualizarListaMensajes(resp.data);
        this.aviso=1;
        setTimeout(() => this.aviso = 0, 4000);
      } else {
        this.aviso=2;
        setTimeout(() => this.aviso = 0, 4000);
      }
    });
  }
}


