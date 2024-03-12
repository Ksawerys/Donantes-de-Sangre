import { Observable, tap } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environment/environment';
import { updateResponse } from '../interfaces/config.interface';
import { Cancion, ResponseAudio,ResponseChat, Himno, ResponseCancion, ResponseFaqs, Faq, ResponseFaq, Check } from '../interfaces/config.interface';
import { Pregunta } from '../../apto-sangre/interface/pregunta';
import { Direccion } from 'src/app/direcciones/interfaces/direcciones.interfaces';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  configUrl = `${environment.baseUrl}/api`;
  private canciones: Cancion[];
  private faqs: Faq[];
  private checks: Check[];
  private aux:number;

  constructor(private http: HttpClient) {
    this.canciones = [];
    this.faqs = [];
    this.checks = [];
    this.aux=0
  }


  //Audio o Himnos (Toda la parte del Audio Isa)
  get audios() {
    return [...this.canciones];
  }
  getListadoAudio(): Observable<ResponseAudio> {
    return this.http.get<ResponseAudio>(`${this.configUrl}/musica/listado`).pipe(tap(resp => { if (resp.success !== false) { this.canciones = resp.data } }))
  }
  agregarAudio(cancion: Cancion) {
    this.canciones.unshift(cancion);
  }

  addAudio(cancion: Himno): Observable<ResponseCancion> {
    const payload = new FormData();
    payload.append('titulo', cancion.titulo);
    payload.append('letra', cancion.letra);
    payload.append('archivo', cancion.archivo);
    const header = {
      headers: new HttpHeaders({
        'x-token': JSON.parse(localStorage.getItem('user')!).token
      })
    };

    return this.http.post<ResponseCancion>(`${this.configUrl}/musica/insertar`, payload, header);
  }
  borrarHimno(id: string) {
    let audios = this.canciones.filter((c) => c.id != id);
    this.canciones = audios;
  }

  borrarAudio(id: string): Observable<ResponseCancion> {
    const header = {
      headers: new HttpHeaders({
        'x-token': JSON.parse(localStorage.getItem('user')!).token
      })
    };

    return this.http.delete<ResponseCancion>(`${this.configUrl}/musica/borrar/${id}`, header);
  }
  borrarHimnoTodos() {
    this.canciones = [];
  }

  borrarTodos(): Observable<ResponseAudio> {
    const header = {
      headers: new HttpHeaders({
        'x-token': JSON.parse(localStorage.getItem('user')!).token
      })
    };

    return this.http.delete<ResponseAudio>(`${this.configUrl}/musica/borrar`, header);
  }

  editarAudio(id: string, cancion: Cancion): Observable<ResponseCancion> {
    const payload = new FormData();
    payload.append('id', id);
    payload.append('titulo', cancion.titulo);
    payload.append('letra', cancion.letra);
    payload.append('archivo', cancion.cancion);
    const header = {
      headers: new HttpHeaders({
        'x-token': JSON.parse(localStorage.getItem('user')!).token
      })
    };
    return this.http.put<ResponseCancion>(`${this.configUrl}/musica/modificar/`, payload, header);
  }
  obtenerCancion(id: string): Observable<ResponseCancion> {
    const header = {
      headers: new HttpHeaders({
        'x-token': JSON.parse(localStorage.getItem('user')!).token
      })
    };

    return this.http.post<ResponseCancion>(`${this.configUrl}/musica/get`, { id: id }, header);
  }
  editarCancion(cancion: Cancion) {
    let posicion = this.canciones.findIndex(c => c.id == cancion.id);
    this.canciones[posicion] = cancion;
  }

  getPreguntas(): Observable<Pregunta[]> {
    return this.http.get<Pregunta[]>(`${this.configUrl}/test-apto/mostrarPreguntas`)
  }

  subirFoto(archivo: FormData): Observable<FormData> {
    return this.http.post<any>(`${this.configUrl}/galeria/insertarGaleria_imagen`, archivo);
  }

  borrarImagenes(id: any): Observable<any> {
    return this.http.delete<any>(`${this.configUrl}/galeria/borrarGaleria_Imagen/${id}`);
  }

  añadirPregunta(pregunta: Pregunta): Observable<any> {
    const payload = new FormData();

    if (pregunta.nombre_img != "") {

      payload.append('enunciado', pregunta.enunciado);
      payload.append('titulo', pregunta.titulo);
      payload.append('archivo', pregunta.nombre_img);
      payload.append('respuesta', pregunta.respuesta.toString());
      payload.append('solucion_problema', pregunta.solucion_problema);

    }
    else {
      payload.append('enunciado', pregunta.enunciado);
      payload.append('titulo', pregunta.titulo);
      payload.append('respuesta', pregunta.respuesta.toString());
      payload.append('solucion_problema', pregunta.solucion_problema);
    }

    return this.http.post<any>(`${this.configUrl}/test-apto/generarPregunta/`, payload);
  }

  modificarPregunta(id: any, pregunta: Pregunta): Observable<any> {
    const payload = new FormData();
    if (pregunta.nombre_img == '') {
      payload.append('enunciado', pregunta.enunciado);
      payload.append('titulo', pregunta.titulo);
      payload.append('respuesta', pregunta.respuesta.toString());
      payload.append('solucion_problema', pregunta.solucion_problema);
    } else {
      payload.append('enunciado', pregunta.enunciado);
      payload.append('titulo', pregunta.titulo);
      payload.append('archivo', pregunta.nombre_img);
      payload.append('respuesta', pregunta.respuesta.toString());
      payload.append('solucion_problema', pregunta.solucion_problema);

    }

    return this.http.put<any>(`${this.configUrl}/test-apto/modificarPregunta/${id}`, payload);
  }

  borrarPregunta(id: any): Observable<any> {
    return this.http.delete<any>(`${this.configUrl}/test-apto/borrarPregunta/${id}`);
  }

  //Para las Faqs
  get resultFaqs() {
    return [...this.faqs];
  }
  getListadoFaqs(): Observable<ResponseFaqs> {
    return this.http.get<ResponseFaqs>(`${this.configUrl}/faq/listado`).pipe(tap(resp => { if (resp.success !== false) { this.faqs = resp.data } }))
  }

  addFaq(pregunta: string, respuesta: string): Observable<ResponseFaq> {
    const header = {
      headers: new HttpHeaders({
        'x-token': JSON.parse(localStorage.getItem('user')!).token
      })
    };
    return this.http.post<ResponseFaq>(`${this.configUrl}/faq/registrar`, { pregunta: pregunta, respuesta: respuesta }, header);
  }

  addFaqInterface(faq: Faq): void {
    this.faqs.push(faq);
    this.checks.push({ id: faq.id, marcado: false });
  }
  editarFaq(id:string,pregunta:string,respuesta:string):Observable<ResponseFaq>{
    const header = {
      headers: new HttpHeaders({
        'x-token': JSON.parse(localStorage.getItem('user')!).token
      })
    };
    return this.http.put<ResponseFaq>(`${this.configUrl}/faq/modificar`, {id:id, pregunta: pregunta, respuesta: respuesta }, header);
  }
  editarFaqInterface(faq:Faq){
    let posicion = this.faqs.findIndex(f => f.id == faq.id);
    this.faqs[posicion] = faq;
  }

  deleteFaqs(listaFaqs: string[]): Observable<ResponseFaqs> {
    const header = {
      headers: new HttpHeaders({
        'x-token': JSON.parse(localStorage.getItem('user')!).token
      }),
      body: { ids: listaFaqs }
    };
    return this.http.delete<ResponseFaqs>(`${this.configUrl}/faq/borrarseleccion`, header);
  }
  borradoFaqsSeleccionadas(listaIds: string[]): void {
    let faq = this.faqs.filter((f) => !listaIds.includes(f.id));
    this.faqs = faq;
    let check=this.checks.filter((c)=>!listaIds.includes(c.id));
    this.checks=check;
  }


  get resultCheck() {
    return [...this.checks];
  }

  generarChecks() {
    if(this.aux==0){
      for (let index = 0; index < this.faqs.length; index++) {
        this.checks.push({ id: this.faqs[index]["id"], marcado: false });
      }
      this.aux++;
    }
  }
  marcarCheck(id: string): void {
    let posicion = this.checks.findIndex(c => c.id == id);
    this.checks[posicion]["marcado"] = true;

  }
  desmarcarCheck(id: string): void {
    let posicion = this.checks.findIndex(c => c.id == id);
    this.checks[posicion]["marcado"] = false;
  }
  desmarcarCheckSeleccionados(): void {
    this.checks.forEach(c => {
      c.marcado = false;
    });
  }
  obtenerFaq(id:string):Faq{
    let faq = this.faqs.filter((f) => f.id == id);
    let faqEditado=faq[0];
    return faqEditado;
  }
  //Para el Chat

  obtenerEstadoChat():Observable<ResponseChat>{
    return this.http.get<ResponseChat>(`${this.configUrl}/chat/estadochat`);
  }
  actualizarEstadoChat(estado:number):Observable<ResponseChat>{
    const header = {
      headers: new HttpHeaders({
        'x-token': JSON.parse(localStorage.getItem('user')!).token
      })
    };
    return this.http.post<ResponseChat>(`${this.configUrl}/chat/actualizarestadochat`,{estado:estado},header);
  }

}
