import { HttpRequest } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { GaleriaService } from '../service/galeria.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { NotificacionesService } from 'src/app/notificaciones/service/notificaciones.service';
@Component({
  selector: 'app-add-imagen',
  templateUrl: './add-imagen.component.html',
  styleUrls: ['./add-imagen.component.scss']
})
export class AddImagenComponent implements OnInit{
  public filedata:any;
  public previsualizacion: string = "";
  public archivos:any = [];
  public loading:boolean = false;
  @Output() recargarImagenes = new EventEmitter();
  @ViewChild('imagen') imagen!: ElementRef<HTMLInputElement>;
  @ViewChild('descripcion') descripcion!: ElementRef<HTMLInputElement>;
  qhp: number = 0;
  puedeModificar: boolean = false;
  estaRegistrado: boolean = false;
  constructor(private sanitizer: DomSanitizer, public galeriaServicio: GaleriaService, private AuthService: AuthService, private notificacionService: NotificacionesService) { }

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user) {
      this.estaRegistrado = true;

      this.comprobarPuedeModificar();
    }

    this.galeriaServicio.comprobarPermisos.subscribe((registrado:boolean) => {
      this.estaRegistrado = registrado;

      this.comprobarPuedeModificar();
    })
  }
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

  subirFoto() {
    const descripcion = this.descripcion.nativeElement;
    try{
      this.loading = true;
      let formularioDeDatos = new FormData();

      this.archivos.forEach((archivo: File) => {
        formularioDeDatos = new FormData();
        formularioDeDatos.append('archivo', archivo);
        formularioDeDatos.append('descripcion', descripcion.value);
        formularioDeDatos.append('propietarioID', JSON.parse(localStorage.getItem('user') || ('')).id)
      })
      if(this.archivos.length > 0){
        this.galeriaServicio.subirFoto(formularioDeDatos)
        .subscribe((res) => {

          this.loading = false;
          this.qhp = 1;
          this.recargarImagenes.emit();

        })
      }

    } catch (e) {
      this.qhp = 3;
      this.loading = false;
    }
  }

  subirPeticionFoto() {
    const descripcion = this.descripcion.nativeElement;
    try{
      this.loading = true;
      let formularioDeDatos = new FormData();

      this.archivos.forEach((archivo: File) => {
        formularioDeDatos = new FormData();
        formularioDeDatos.append('archivo', archivo);
        formularioDeDatos.append('descripcion', descripcion.value);
        formularioDeDatos.append('propietarioID', JSON.parse(localStorage.getItem('user') || ('')).id)
      })
      if(this.archivos.length > 0){
        this.galeriaServicio.subirPeticionFoto(formularioDeDatos)
        .subscribe((res) => {

          this.loading = false;
          this.qhp = 2;
          const peticionImagenID = res.id
          this.galeriaServicio.mandarCorreoAdministradoresPeticion(peticionImagenID).subscribe((res) => {
            console.log(res);
          });
          const contenido = new FormData();
          contenido.append('idUser', JSON.parse(localStorage.getItem('user') || ('')).id);
          contenido.append('idImagenPeticion', peticionImagenID);
          this.notificacionService.crearNotificacionesAdministradores(contenido).subscribe((res) => {
            console.log(res);
          })
        })

      }

    } catch (e) {
      this.qhp = 3;
      this.loading = false;
    }
  }

  limpiarContenido(){
    const imagen =  this.imagen.nativeElement;
    const descripcion = this.descripcion.nativeElement;
    imagen.value = "";
    this.previsualizacion = "";
    descripcion.value = "";
    this.qhp = 0;
  }

  comprobarPuedeModificar() {
    if (this.estaRegistrado) {
      this.AuthService.puedeModificar().subscribe((resp:boolean) => {
        this.puedeModificar = (resp) ? true : false;
      });
    }
  }
}
