import { Component, ElementRef, EventEmitter, Input, Output, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Pregunta } from 'src/app/apto-sangre/interface/pregunta';
import { ConfigService } from '../../services/config.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-borrar-pregunta',
  templateUrl: './borrar-pregunta.component.html',
  styleUrls: ['./borrar-pregunta.component.scss']
})
export class BorrarPreguntaComponent {
  @Input() preguntas_array!: Pregunta[];
  @Output() recargarPreguntas = new EventEmitter();
  public filedata:any;
  public previsualizacion_apto_sangre: string = "";
  public archivos:any = [];
  public loading:boolean = false;
  pregunta: Pregunta = {
    id: 0,
    enunciado: "",
    titulo: "",
    nombre_img: "",
    respuesta: 0,
    solucion_problema: ""
  }
  mostrar: boolean = false;
  mostrar_confirmacion: boolean = true;
  @ViewChild('select') select!: ElementRef<HTMLInputElement>;
  @ViewChild('respuesta_si') respuesta_si!: ElementRef<HTMLInputElement>;
  @ViewChild('respuesta_no') respuesta_no!: ElementRef<HTMLInputElement>;
  @ViewChild('boton_borrar') boton!: ElementRef<HTMLInputElement>;
  formulario = new FormGroup({
    pregunta: new FormControl("Selecciona una pregunta", Validators.required)
  })
  constructor(private sanitizer: DomSanitizer, private renderer2: Renderer2, private config_Service: ConfigService) { }


  preguntaSeleccionada(){
    const selector = this.select.nativeElement;
    if(!isNaN(parseInt(selector.value))){
      this.mostrar_confirmacion = true;
    }
    else{
      this.mostrar_confirmacion = false;


    }
  }


  seleccionarPregunta(){
    const selector = this.select.nativeElement;
    const si = this.respuesta_si.nativeElement;
    const no = this.respuesta_no.nativeElement;
    if(!isNaN(parseInt(selector.value))){
      this.mostrar = true;
      let i = 0
      let conseguido = false;
      for(i; i < this.preguntas_array.length && !conseguido; i++){
        if(this.preguntas_array[i].id == parseInt(selector.value)){
          conseguido = true;
        }
      }
      this.pregunta.id = this.preguntas_array[i - 1].id;
      this.pregunta.enunciado = this.preguntas_array[i - 1].enunciado;
      this.pregunta.titulo = this.preguntas_array[i - 1].titulo;
      this.pregunta.solucion_problema = this.preguntas_array[i - 1].solucion_problema;
      this.pregunta.nombre_img = this.preguntas_array[i - 1].nombre_img;
      this.pregunta.respuesta = this.preguntas_array[i - 1].respuesta;

      this.previsualizacion_apto_sangre = this.pregunta.nombre_img


      if(this.pregunta.respuesta == 1){
        si.checked = true;
        no.checked = false;
      }
      else{
        si.checked = false;
        no.checked = true;
      }

    }
    else{
      this.mostrar = false;
      si.checked = false;
      no.checked = false;
      this.pregunta.titulo = ''
      this.pregunta.enunciado = '';
      this.pregunta.solucion_problema = '';
      this.previsualizacion_apto_sangre = "";

    }
  }

  borrarPregunta(){
    const selector = this.select.nativeElement;
    if(isNaN(parseInt(selector.value))){
    }
    else{
      this.config_Service.borrarPregunta(selector.value).subscribe((res) => {
        this.loading = false;
        this.renderer2.setProperty(selector, "selectedIndex", 0);
        this.mostrar = false;
        this.recargarPreguntas.emit();

      })
    }
  }
}
