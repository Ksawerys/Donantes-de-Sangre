import { Component,OnInit } from '@angular/core';
import { ConfigService } from '../services/config.service';
import { Check, Faq } from '../interfaces/config.interface';

@Component({
  selector: 'app-faqs-config',
  templateUrl: './faqs-config.component.html',
  styleUrls: ['./faqs-config.component.scss']
})
export class FaqsConfigComponent implements OnInit {
  listaFaq: string[];
  idEditado: string;
  faqEditar:Faq;

  constructor(private ConfigService: ConfigService) {
    this.listaFaq = [];
    this.idEditado = "";
    this.faqEditar={
      id:"0",
      pregunta:"",
      respuesta:""
    }
  }

  ngOnInit() {
    this.ConfigService.getListadoFaqs().subscribe((res) => { this.ConfigService.generarChecks(); });
  }
  get faqs() {
    return this.ConfigService.resultFaqs;
  }
  get checks(){
    return this.ConfigService.resultCheck;
  }
  actualizarLista(){
    this.listaFaq=[];
  }
  enviarFaq(event:any){
    let id = event.target.id;
    this.idEditado = id.slice(1);
    this.faqEditar=this.ConfigService.obtenerFaq(this.idEditado);
  }
  faqSeleccionado(event: any): void {
    if (event.target.checked) {
      this.listaFaq.push(event.target.id);
      this.ConfigService.marcarCheck(event.target.id);
    }
    else {
      let i = this.listaFaq.indexOf(event.target.id);
      this.listaFaq.splice(i, 1);
      this.ConfigService.desmarcarCheck(event.target.id);
    }
  }
}
