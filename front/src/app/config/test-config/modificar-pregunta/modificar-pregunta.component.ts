import { Component, ElementRef, EventEmitter, Input, Output, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Pregunta } from 'src/app/apto-sangre/interface/pregunta';
import { ConfigService } from '../../services/config.service';
import { FormControl, FormGroup, Validators, NgModel, NgForm } from '@angular/forms';
import { PreguntasComponent } from '../../../apto-sangre/preguntas/preguntas.component';

@Component({
  selector: 'app-modificar-pregunta',
  templateUrl: './modificar-pregunta.component.html',
  styleUrls: ['./modificar-pregunta.component.scss']
})
export class ModificarPreguntaComponent{
  @Input() preguntas_array!: Pregunta[];
  @Output() recargarPreguntas = new EventEmitter();
  public filedata:any;
  public previsualizacion: string = "";
  public previsualizacion_apto_sangre: string = "";
  public archivos:any = [];
  public loading:boolean = false;
  mostrar: boolean = false;
  pregunta_seleccionada_id!: number;
  pregunta_seleccionada_titulo!: string;
  pregunta_seleccionada_enunciado!: string;
  pregunta_seleccionada_img!: string;
  pregunta_seleccionada_respuesta!: number;
  pregunta_seleccionada_sol_problema!: string;
  @ViewChild('select') select!: ElementRef<HTMLInputElement>;
  @ViewChild('titulo') titulo!: ElementRef<HTMLInputElement>;
  @ViewChild('enunciado') enunciado!: ElementRef<HTMLInputElement>;
  @ViewChild('respuesta_si') respuesta_si!: ElementRef<HTMLInputElement>;
  @ViewChild('respuesta_no') respuesta_no!: ElementRef<HTMLInputElement>;
  @ViewChild('input_file') input_file!: ElementRef<HTMLInputElement>;
  @ViewChild('recomendacion_problema') recomendacion!: ElementRef<HTMLInputElement>;
  qhp: number = 0;

  pregunta: Pregunta = {
    id: 0,
    enunciado: "",
    titulo: "",
    nombre_img: "",
    respuesta: 0,
    solucion_problema: ""
  }



  constructor(private sanitizer: DomSanitizer, private renderer2: Renderer2, private config_Service: ConfigService) { }

  capturarFile(event: any) {
    const archivoCapturado = event.target.files[0];
    if(archivoCapturado.type == 'image/jpg' || archivoCapturado.type == 'image/gif' || archivoCapturado.type == 'image/png'
    || archivoCapturado.type == 'image/jpeg' || archivoCapturado.type == 'image/tiff' || archivoCapturado.type == 'image/svg' || archivoCapturado.type == 'image/webp'){
      this.extraerBase64(archivoCapturado).then((imagen: any)=> {
        this.previsualizacion = imagen.base;
      })
      this.archivos.push(archivoCapturado);
    }
    this.previsualizacion_apto_sangre = "";
  }

  extraerBase64 = async (event: any) => new Promise((resolve, reject) => {
    try{
      const unsafeImg = window.URL.createObjectURL(event);
      const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
      const reader = new FileReader();
      reader.readAsDataURL(event);
      reader.onload = () => {
        resolve({
          base: reader.result
        });
      };
      reader.onerror = error => {
        resolve({
          base: null
        });
      };
      return reader;
    } catch (err) {
      return null;
    }
  })



  seleccionarPregunta(){
    this.qhp = 0;
    const selector = this.select.nativeElement;
    const si = this.respuesta_si.nativeElement;
    const no = this.respuesta_no.nativeElement;
    const cogerImagen = this.input_file.nativeElement;

    if(!isNaN(parseInt(selector.value))){
      let i = 0
      let conseguido = false;
      for(i; i < this.preguntas_array.length && !conseguido; i++){
        if(this.preguntas_array[i].id == parseInt(selector.value)){
          conseguido = true;
        }
      }
      this.mostrar = true;
      this.pregunta.id = this.preguntas_array[i - 1].id;
      this.pregunta.enunciado = this.preguntas_array[i - 1].enunciado;
      this.pregunta.titulo = this.preguntas_array[i - 1].titulo;
      this.pregunta.solucion_problema = this.preguntas_array[i - 1].solucion_problema;
      this.pregunta.nombre_img = this.preguntas_array[i - 1].nombre_img;
      this.pregunta.respuesta = this.preguntas_array[i - 1].respuesta;
      let list = new DataTransfer();
      let file = new File(["content"], this.pregunta.nombre_img);
      list.items.add(file);
      let myFileList = list.files;



      cogerImagen.files = myFileList;
      this.archivos.push(cogerImagen.files[0]);

      this.previsualizacion_apto_sangre = this.pregunta.nombre_img
      this.previsualizacion = "";

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
      cogerImagen.value = "";
      this.previsualizacion_apto_sangre = "";

    }
  }

  modificarPregunta() {
    const selector = this.select.nativeElement;
    const titulo = this.titulo.nativeElement;
    const enunciado = this.enunciado.nativeElement;
    const si = this.respuesta_si.nativeElement;
    const no = this.respuesta_no.nativeElement;
    const solucion_problema = this.recomendacion.nativeElement;



    this.renderer2.setAttribute(si,"value", "1");
    this.renderer2.setAttribute(no,"value", "0");

    if(isNaN(parseInt(selector.value))){
      this.qhp = 3;
    }
    else{
      this.pregunta.titulo = titulo.value;
      this.pregunta.enunciado = enunciado.value;
      if(this.pregunta.nombre_img == this.archivos[this.archivos.length - 1].name){
        this.pregunta.nombre_img = '';
      }
      else{
        this.pregunta.nombre_img = this.archivos[this.archivos.length - 1];
      }
      if(si.checked){
        this.pregunta.respuesta = parseInt(si.value);
      }
      else{
        this.pregunta.respuesta = parseInt(no.value);
      }
      this.pregunta.solucion_problema = solucion_problema.value;
      try{
        this.loading = true;
        this.config_Service.modificarPregunta(this.pregunta.id, this.pregunta).subscribe((res) => {
          this.loading = false;
          this.qhp = 1;
          this.recargarPreguntas.emit();


        });
      }
      catch(e){
        this.qhp = 2;
      }
    }
  }
}
