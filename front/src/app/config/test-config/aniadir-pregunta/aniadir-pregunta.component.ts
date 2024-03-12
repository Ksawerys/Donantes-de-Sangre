import { Component, ElementRef, EventEmitter, Output, ViewChild, Renderer2 } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ConfigService } from '../../services/config.service';
import { Pregunta } from '../../../apto-sangre/interface/pregunta';

@Component({
  selector: 'app-aniadir-pregunta',
  templateUrl: './aniadir-pregunta.component.html',
  styleUrls: ['./aniadir-pregunta.component.scss']
})
export class AniadirPreguntaComponent {

  public filedata:any;
  public previsualizacion: string = "";
  public archivos:any = [];
  public loading:boolean = false;

  @ViewChild('titulo') titulo!: ElementRef<HTMLInputElement>;
  @ViewChild('enunciado') enunciado!: ElementRef<HTMLInputElement>;
  @ViewChild('respuesta_si') respuesta_si!: ElementRef<HTMLInputElement>;
  @ViewChild('respuesta_no') respuesta_no!: ElementRef<HTMLInputElement>;
  @ViewChild('recomendacion_problema') recomendacion!: ElementRef<HTMLInputElement>;
  obligatorio : boolean = false;
  qhp: number = 0;
  pregunta: Pregunta = {
    id: 0,
    enunciado: "",
    titulo: "",
    nombre_img: "",
    respuesta: 0,
    solucion_problema: ""
  }
  @Output() recargarPreguntas = new EventEmitter();
  constructor(private sanitizer: DomSanitizer, private renderer2: Renderer2,private config_Service: ConfigService) { }

  capturarFile(event: any) {
    const archivoCapturado = event.target.files[0];

    if(archivoCapturado.type == 'image/jpg' || archivoCapturado.type == 'image/gif' || archivoCapturado.type == 'image/png'
    || archivoCapturado.type == 'image/jpeg' || archivoCapturado.type == 'image/tiff' || archivoCapturado.type == 'image/svg' || archivoCapturado.type == 'image/webp'){
      this.extraerBase64(archivoCapturado).then((imagen: any)=> {
        this.previsualizacion = imagen.base;
      })
      this.archivos.push(archivoCapturado);
    }

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

  subirFoto(): any {
    try{
      this.loading = true;
      let formularioDeDatos = new FormData();

      this.archivos.forEach((archivo: File) => {
        formularioDeDatos = new FormData();
        formularioDeDatos.append('archivo', archivo);
      })
      if(this.archivos.length > 0){
        this.config_Service.subirFoto(formularioDeDatos)
        .subscribe((res) => {

          this.loading = false;
          // this.recargarImagenes.emit();

        })
      }

    } catch (e) {
      this.loading = false;
    }
  }

  ingresarPregunta() {
    const titulo = this.titulo.nativeElement;
    const enunciado = this.enunciado.nativeElement;
    const si = this.respuesta_si.nativeElement;
    const no = this.respuesta_no.nativeElement;
    const solucion_problema = this.recomendacion.nativeElement;
    this.renderer2.setAttribute(si,"value", "1");
    this.renderer2.setAttribute(no,"value", "0");

    if(titulo.value.trim() != "" &&  enunciado.value.trim() != "" &&  (!si.checked || !no.checked)){
      this.obligatorio = false;
      this.pregunta.enunciado = enunciado.value;
      this.pregunta.titulo = titulo.value
      if(this.archivos.length > 0){
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
        this.config_Service.añadirPregunta(this.pregunta).subscribe((res) => {
          this.loading = false;
          this.qhp = 1;
          this.recargarPreguntas.emit();

        });
      }
      catch(e){
        this.qhp = 2;
      }


    }
    else{
      this.obligatorio = true;
    }
  }

  cerrandoMensaje(){
    this.obligatorio = false;
    this.qhp = 0;
  }
}
