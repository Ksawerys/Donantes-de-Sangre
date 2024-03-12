import { Component, ViewChild, ElementRef, Renderer2, OnInit, SimpleChanges, AfterViewChecked } from '@angular/core';
import { GaleriaService } from './service/galeria.service';
import { Galeria } from './interface/galeria';
import { AuthService } from 'src/app/auth/services/auth.service';
import { animate, style, transition, trigger, AnimationEvent } from '@angular/animations';
@Component({
  selector: 'app-galeria',
  templateUrl: './galeria.component.html',
  styleUrls: ['./galeria.component.scss'],
  animations: [
    trigger('animation', [
      transition('void => visible', [
        style({transform: 'scale(0.5)'}),
        animate('150ms', style({transform: 'scale(1)'}))
      ]),
      transition('visible => void', [
        style({transform: 'scale(1)'}),
        animate('150ms', style({transform: 'scale(0.5)'}))
      ]),
    ]),
    trigger('animation2', [
      transition(':leave', [
        style({opacity: 1}),
        animate('50ms', style({opacity: 0.8}))
      ])
    ])
  ]
})
export class GaleriaComponent implements OnInit, AfterViewChecked{
  p: number = 1;
  imagenesSeleccionadas: any[] = [];
  galeria_imagenes: Galeria[] = [];
  puedeModificar: boolean = false;
  estaRegistrado: boolean = false;

  previewImage = false;
  showMask = false;
  showCount = false;
  currentLightboxImage: Galeria = this.galeria_imagenes[0];
  currentIndex = 0;
  controls = true;
  totalImageCount = 0;

  constructor(public galeriaServicio: GaleriaService, private AuthService: AuthService) { }




  ngOnInit(): void {
    this.galeriaServicio.getGaleria_Imagenes().subscribe( imagen => {this.galeria_imagenes = imagen});



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

  ngAfterViewChecked(): void {
    this.totalImageCount = this.galeria_imagenes.length;
  }


  eliminandoFotos(): void{

    this.imagenesSeleccionadas.forEach(id => {
      this.galeriaServicio.borrarImagenes(id).subscribe((res) => {
        this.mostrarImagenes();
      })
    })

  }

  mostrarImagenes(): void{
    this.galeriaServicio.getGaleria_Imagenes().subscribe( imagen => {this.galeria_imagenes = imagen});
  }

  fotoSeleccionada(event: any): void{
    if(event.target.type == 'checkbox'){
      if(event.target.checked){
        this.imagenesSeleccionadas.push(event.target.id);
      }
      else{
        let i = this.imagenesSeleccionadas.indexOf(event.target.id);
        this.imagenesSeleccionadas.splice(i, 1);
      }
    }
  }

  onPreviewImage(index: number): void{
    //mostrar Imagen despues de pinchar una de ellas
    this.showCount = true;
    this.showMask = true;
    this.previewImage = true;

    if(this.p > 1){
      let contador = this.p;
      while(contador == this.p){
        contador = contador - 1;
      }

      index = (contador * 6) + index;
    }

    this.currentIndex = index;

    this.currentLightboxImage = this.galeria_imagenes[index];
  }

  onAnimationEnd(event: AnimationEvent){
    if(event.toState === 'void'){
      this.showMask = false;
    }
  }

  onClosePreview(){
    this.previewImage = false;
  }

  prev(): void {
    this.currentIndex = this.currentIndex - 1;
    if(this.currentIndex < 0){
      this.currentIndex = this.galeria_imagenes.length - 1;
    }
    this.currentLightboxImage = this.galeria_imagenes[this.currentIndex];
  }

  next(): void {
    this.currentIndex = this.currentIndex + 1;
    if(this.currentIndex > this.galeria_imagenes.length - 1){
      this.currentIndex = 0;
    }
    this.currentLightboxImage = this.galeria_imagenes[this.currentIndex];
  }


  comprobarPuedeModificar() {
    if (this.estaRegistrado) {
      this.AuthService.puedeModificar().subscribe((resp:boolean) => {
        this.puedeModificar = (resp) ? true : false;
      });
    }
  }
}
