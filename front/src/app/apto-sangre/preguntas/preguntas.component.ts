import { Component, ViewChild, ElementRef, Renderer2, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Pregunta } from '../interface/pregunta';

@Component({
  selector: 'app-preguntas',
  templateUrl: './preguntas.component.html',
  styleUrls: ['./preguntas.component.scss']
})
export class PreguntasComponent implements OnChanges{
  contador_pregunta : number = 0;
  @Input() pregunta!: Pregunta;
  @Output() botonAparece = new EventEmitter();
  @ViewChild('imagen') imagen!: ElementRef;
  @ViewChild('{{pregunta.titulo}}_si') radio_si!: ElementRef<HTMLInputElement>;
  @ViewChild('{{pregunta.titulo}}_no') radio_no!: ElementRef<HTMLInputElement>;

  constructor(private renderer2: Renderer2){}


  ngOnChanges(changes: SimpleChanges) {
    if(this.radio_si != null && this.radio_no != null){
      const imagen = this.imagen.nativeElement;
      const radio_si = this.radio_si.nativeElement;
      const radio_no = this.radio_no.nativeElement;
      if(radio_si.checked == true){
        radio_si.checked = false;
      }
      else{
        radio_no.checked = false;
      }
    }
  }

  dandoValor($event: any): void{
    const radio_si = this.radio_si.nativeElement;
    const radio_no = this.radio_no.nativeElement;
    this.renderer2.setAttribute(radio_si,"value", "1");
    this.renderer2.setAttribute(radio_no,"value", "0");
    this.botonAparece.emit($event.target.value);

  }


}
