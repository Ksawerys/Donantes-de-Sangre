//Todo Isa
import { Component, ElementRef, ViewChild } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Himno, Cancion } from '../../interfaces/config.interface';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-add-himno',
  templateUrl: './add-himno.component.html',
  styleUrls: ['./add-himno.component.scss']
})
export class AddHimnoComponent {
  addLetra: AngularEditorConfig = {
    editable: true,
    height: '100px',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    toolbarHiddenButtons: [['fontName', 'insertImage', 'insertVideo', 'insertHorizontalRule']]
  };
  res: string;
  alert: string;
  aviso: number;
  cancion: Himno;

  @ViewChild('audio') audio!: ElementRef<HTMLInputElement>;

  constructor(private ConfigService: ConfigService) {
    this.res = "no";
    this.alert = "no";
    this.aviso = 0
    this.cancion = {
      titulo: "",
      letra: "",
      archivo: ""
    }
  }


  limpiarAlert() {
    this.alert = "no";
    this.aviso = 0;
  }


  capturarFile(event: any): any {
    const files = event.target.files[0];
    this.cancion.archivo = files;
  }


  limpiarContenido() {
    this.cancion.titulo = "";
    this.cancion.letra = "";
    this.audio.nativeElement.value = ''

  }
  comprobarExtension(file: any): boolean {
    let permitida = false;
    if (file != "") {
      let extensiones_permitidas = ['.mp3', ".mp4"];
      let extension = (file.name.substring(file.name.lastIndexOf("."))).toLowerCase();
      if (extension != "") {
        for (let i = 0; i < extensiones_permitidas.length && !permitida; i++) {
          if (extensiones_permitidas[i] == extension) {
            permitida = true;
          }
        }
      }
    } else {
      permitida = true;
    }
    return permitida;
  }


  agregarAudio() {
    if (this.cancion.titulo.trim().length === 0 || Object.prototype.toString.call(this.cancion.archivo) === '[object String]') {
      this.alert = "si";
    } else {
      if (!this.comprobarExtension(this.cancion.archivo)) {
        this.aviso = 3;
      } else {
        this.ConfigService.addAudio(this.cancion).subscribe((res) => {
          if (res.success !== false) {
            this.aviso = 1;
            this.ConfigService.agregarAudio(res.data);
            this.limpiarContenido();

          } else {
            this.aviso = 2;
          }
        });
      }
    }

  }
}

