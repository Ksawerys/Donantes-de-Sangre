import { Component } from '@angular/core';
import { ConfigService } from '../services/config.service';
import { Cancion } from '../interfaces/config.interface';

@Component({
  selector: 'app-himno-config',
  templateUrl: './himno-config.component.html',
  styleUrls: ['./himno-config.component.scss']
})
export class HimnoConfigComponent {
  idBorrar: string
  idModificado: string;
  infoAudio: Cancion;
  qho: string;

  constructor(private ConfigService: ConfigService) {
    this.qho = "no";
    this.idBorrar = "";
    this.idModificado = "";
    this.infoAudio = {
      id: "",
      nombre: "",
      titulo: "",
      letra: "",
      cancion: "",
      descarga: ""
    };
  }

  ngOnInit() {
    this.ConfigService.getListadoAudio().subscribe((res) => {
    });
  }
  get audios() {
    return this.ConfigService.audios;
  }
  obtenerId(event: any) {
    let id = event.target.id;
    this.idBorrar = id.slice(1);
  }
  obtenerIdEditado(event: any) {
    let id = event.target.id;
    this.idModificado = id.slice(1);
  }
  obtenerAudioModificar() {
    this.ConfigService.obtenerCancion(this.idModificado).subscribe({
      next: data => {
        if (data.success !== false) {
          this.infoAudio = data.data;
        }
      },
      error: error => {
        this.qho = "si";
      }
    });
  }
}
