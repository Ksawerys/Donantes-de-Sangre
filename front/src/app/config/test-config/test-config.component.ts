import { Component, OnInit, DoCheck } from '@angular/core';
import { ConfigService } from '../services/config.service';
import { Pregunta } from '../../apto-sangre/interface/pregunta';


@Component({
  selector: 'app-test-config',
  templateUrl: './test-config.component.html',
  styleUrls: ['./test-config.component.scss']
})
export class TestConfigComponent implements OnInit{
  pregunta!: Pregunta;
  preguntas: Pregunta[] = [];
  mensaje_respuesta: string[] = [];
  constructor(private config_Service: ConfigService){}
  ngOnInit(): void {
      this.config_Service.getPreguntas().subscribe( pregunta => {this.preguntas = pregunta});
  }


  mostrarPreguntas(): void {
    this.config_Service.getPreguntas().subscribe( pregunta => {this.preguntas = pregunta});
  }


}
