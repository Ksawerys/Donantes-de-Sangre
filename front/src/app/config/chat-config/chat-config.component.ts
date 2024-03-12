import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../services/config.service';
@Component({
  selector: 'app-chat-config',
  templateUrl: './chat-config.component.html',
  styleUrls: ['./chat-config.component.scss']
})
export class ChatConfigComponent implements OnInit {

  habilitado:number;
  aviso:number;

  constructor(private ConfigService: ConfigService) {
    this.habilitado=-1;
    this.aviso=0;
  }
  ngOnInit() {
    this.ConfigService.obtenerEstadoChat().subscribe((res) => {this.habilitado=res.data});
  }
  actulizarEstado(estado:number):void{
    this.ConfigService.actualizarEstadoChat(estado).subscribe((res)=>{
      if(res.success==true){
        this.aviso = 1;
        setTimeout(() => this.aviso = 0, 4000);
        this.habilitado=res.data
      }else{
        this.aviso = 2;
        setTimeout(() => this.aviso = 0, 4000);
      }
    })
  }

}
