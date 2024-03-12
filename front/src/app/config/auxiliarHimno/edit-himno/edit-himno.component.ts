//Isa
import { Component, ElementRef, ViewChild, Input } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Cancion } from '../../interfaces/config.interface';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-edit-himno',
  templateUrl: './edit-himno.component.html',
  styleUrls: ['./edit-himno.component.scss']
})
export class EditHimnoComponent {
  editadoConfig: AngularEditorConfig = {
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
  correcto: boolean;

  @Input() idModificado: string;
  @Input() infoAudio: Cancion;
  @Input() qho: string;

  @ViewChild('audio') audio!: ElementRef<HTMLInputElement>;


  constructor(private ConfigService: ConfigService) {
    this.qho = "no"
    this.res = "no";
    this.alert = "no";
    this.aviso = 0;
    this.correcto = true;
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

  limpiarAlert() {
    this.alert = "no";
    this.aviso = 0;
    this.qho = "no";
  }
  capturarFile(event: any) {
    const files = event.target.files[0];
    this.infoAudio.cancion = files;
    if (!this.comprobarExtension(files)) {
      this.aviso = 3;
    }
  }
  comprobarExtension(file: any): boolean {
    let permitida = false;
    this.correcto = false;
    let extensiones_permitidas = ['.mp4', ".mp3"];
    let extension = (file.name.substring(file.name.lastIndexOf("."))).toLowerCase();
    if (extension != "") {
      for (let i = 0; i < extensiones_permitidas.length && !permitida; i++) {
        if (extensiones_permitidas[i] == extension) {
          permitida = true;
          this.correcto = true;
        }
      }
    }
    return permitida;
  }

  limpiarContenido() {
    this.infoAudio.id = "";
    this.infoAudio.nombre = "";
    this.infoAudio.titulo = "";
    this.infoAudio.letra = "";
    this.infoAudio.cancion = "";
    this.infoAudio.descarga = "";
    this.audio.nativeElement.value = ''
  }

  editarAudio() {
    if (this.infoAudio.titulo.trim().length === 0) {
      this.alert = "si";
    } else if (!this.correcto) {
      this.aviso = 3;
    } else {
      this.ConfigService.editarAudio(this.idModificado, this.infoAudio).subscribe({
        next: data => {
          if (data.success !== false) {
            this.ConfigService.editarCancion(data.data);
            this.limpiarContenido();
            this.aviso = 1;
          }
        },
        error: error => {
          this.aviso = 2;
        }
      });
    }
  }
}
