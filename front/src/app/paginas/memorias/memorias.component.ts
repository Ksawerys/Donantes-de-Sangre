import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Memoria, MemoriaAddUpdate } from '../interfaces/paginas.interface';
import { PaginasService } from '../services/paginas.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { entradaSalidaVentana } from 'src/app/shared/animaciones/animaciones';
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-memorias',
  templateUrl: './memorias.component.html',
  styleUrls: ['./memorias.component.scss'],
  animations: [ entradaSalidaVentana ]
})
export class MemoriasComponent implements OnInit {

  @ViewChild('closeModal') closeModal!: ElementRef;

  timer: NodeJS.Timeout | undefined;
  estaRegistrado: boolean = false;
  puedeModificar: boolean = false;
  imagenError: boolean = true;
  documentoError: boolean = true;
  codAccion: number = -1;
  codDescarga: number = -1;
  imgNoValida = 'null';
  accion: string = '';
  acciones = ['añadir', 'editar', 'eliminar'];
  infoMemoria!: MemoriaAddUpdate;
  memorias: Memoria[] = [];

  constructor(
    private paginasService: PaginasService,
    private authService: AuthService
  ) {
    this.limpiarMemoria();
  }


  ngOnInit() {
    const user = localStorage.getItem('user');
    if (user) {
      this.estaRegistrado = true;

      this.comprobarPuedeModificar();
    }

    this.paginasService.getMemorias()
      .subscribe(resp => {

        if (resp.success) {
          this.memorias = resp.data;
        }
      });
  }


  get nombreImgMemoria() {
    let resp = 'No se ha seleccionado ninguna imagen.';

    if (this.infoMemoria.imagen) {
      const nombre = this.getNombre(this.infoMemoria.imagen.name);

      if (nombre != this.imgNoValida) resp = nombre;
    }

    return resp;
  }


  get nombreDocMemoria() {
    let resp = 'No se ha seleccionado ningún archivo.';

    if (this.infoMemoria.documento)
      resp = this.getNombre(this.infoMemoria.documento.name);

    return resp;
  }


  setInfoMemoria(index: number) {
    const memoria = this.memorias[index];

    this.infoMemoria = { id: memoria.id, anio: memoria.anio };
    if (this.getNombre(memoria.imagen) != this.imgNoValida) this.infoMemoria.imagen = new File([""], memoria.imagen);
    if (memoria.documento) this.infoMemoria.documento = new File([""], memoria.documento);
  }


  onImgSeleccionada(event: Event) {
    const permitidas = ['.png', '.jpg', '.jpeg', '.gif', '.tiff', '.svg', '.webp'];
    const img = ((event.target as HTMLInputElement).files as FileList)[0];

    if (this.comprobarExtension(img, permitidas)) {
      if (this.infoMemoria.imagen && !this.infoMemoria.imgBorrar && this.accion == this.acciones[1])
        this.infoMemoria.imgBorrar = this.getNombre(this.infoMemoria.imagen.name);

      this.infoMemoria.imagen = img;

    } else this.imagenError = false;
  }


  onDocumentoSeleccionado(event: Event) {
    const permitidas = ['.pdf', '.odt', '.doc', '.docx'];
    const documento = ((event.target as HTMLInputElement).files as FileList)[0];

    if (this.comprobarExtension(documento, permitidas)) {
      if (this.infoMemoria.documento && !this.infoMemoria.docBorrar && this.accion == this.acciones[1])
        this.infoMemoria.docBorrar = this.getNombre(this.infoMemoria.documento.name);

      this.infoMemoria.documento = documento;

    } else this.documentoError = false;
  }


  comprobarExtension(file: File, permitidas: string[]) {
    const extension = (file.name.substring(file.name.lastIndexOf("."))).toLowerCase();

    return (permitidas.includes(extension)) ? true : false;
  }


  eliminarImg() {
    if (this.infoMemoria.imagen) {
      if (this.accion == this.acciones[1] && !this.infoMemoria.imgBorrar)
        this.infoMemoria.imgBorrar = this.getNombre(this.infoMemoria.imagen.name);

      delete this.infoMemoria.imagen;
    }
  }


  eliminarDoc() {
    if (this.infoMemoria.documento) {
      if (this.accion == this.acciones[1] && !this.infoMemoria.docBorrar)
        this.infoMemoria.docBorrar = this.getNombre(this.infoMemoria.documento.name);

      delete this.infoMemoria.documento;
    }
  }


  insertOrUpdateMemoria() {
    this.paginasService.insertOrUpdateMemoria(this.infoMemoria)
      .subscribe( resp => {

        if (resp.success) {
          this.codAccion = 0;
          let index = this.memorias.findIndex(m => m.id == resp.data.id);

          if (index == -1) this.memorias.push(resp.data)
          else this.memorias[index] = resp.data;

        } else this.codAccion = 1;

        this.setTimer(4000);
        this.closeModal.nativeElement.click();
        this.limpiarMemoria();
      })
  }


  borrarMemoria(index: number) {
    this.paginasService.borrarMemoria(this.memorias[index].id)
      .subscribe(resp => {

        if (resp.success) {
          this.memorias.splice(index, 1);
          this.codAccion = 0;

        } else {
          this.codAccion = 1;
        }

        this.setTimer(4000);
      });
  }


  descargarArchivo(archivo: string) {
    const nombre = archivo.substring(archivo.lastIndexOf("/") + 1);

    this.paginasService.descargarArchivo(nombre)
      .subscribe({
        next: resp => {
          saveAs(resp, nombre);
        },
        error: error => {
          this.accion = 'descargar';
          this.codAccion = 1;
        }
      });
  }


  limpiarMemoria() {
    this.infoMemoria = { id: -1, anio: new Date().getFullYear() };
  }


  getNombre(nombre: string) {
    return nombre.substring(nombre.lastIndexOf("/") + 1);
  }


  setTimer(tiempo: number) {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.codAccion = -1, tiempo);
  }


  irA(url: string){
    if (url != null) window.open(url, "_blank");
  }


  comprobarPuedeModificar() {
    if (this.estaRegistrado) {
      this.authService.puedeModificar().subscribe(resp => {
        this.puedeModificar = (resp) ? true : false;
      });
    }
  }
}

