import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environment/environment';
import { BorrarMemResponse, Cancion, GetMemResponse, ResponseAudio, Faq, ResponseFaqs , InsertUpdateMemResponse, MemoriaAddUpdate } from '../interfaces/paginas.interface';

@Injectable({
  providedIn: 'root'
})
export class PaginasService {

  baseUrl = environment.baseUrl + '/api';
  private canciones: Cancion[];
  private faqs: Faq[];

  constructor(private http: HttpClient) {
    this.canciones = [];
    this.faqs = [];
  }


  getMemorias(): Observable<GetMemResponse> {
    return this.http.get<GetMemResponse>(`${this.baseUrl}/getMemorias`);
  }


  borrarMemoria(id: number): Observable<BorrarMemResponse> {
    const header = {
      headers: new HttpHeaders({
        'x-token': JSON.parse(localStorage.getItem('user')!).token
      })
    };

    return this.http.delete<BorrarMemResponse>(`${this.baseUrl}/deleteMemoria/${id}`, header);
  }


  insertOrUpdateMemoria(memoria: MemoriaAddUpdate): Observable<InsertUpdateMemResponse> {
    const header = {
      headers: new HttpHeaders({
        'x-token': JSON.parse(localStorage.getItem('user')!).token
      })
    };

    const payload = new FormData();
    payload.append('id', memoria.id.toString());
    payload.append('anio', memoria.anio.toString());
    if (memoria.imagen) payload.append('imagen', memoria.imagen);
    if (memoria.documento) payload.append('documento', memoria.documento);
    if (memoria.imgBorrar) payload.append('imgBorrar', memoria.imgBorrar);
    if (memoria.docBorrar) payload.append('docBorrar', memoria.docBorrar);

    return this.http.put<InsertUpdateMemResponse>(`${this.baseUrl}/insertOrUpdateMemoria`, payload, header);
  }


  descargarArchivo(archivo: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/download/${archivo}`, { responseType: 'blob' });
  }


  //Para Pagina de Himnos
  get result() {
    return [...this.canciones];
  }


  getListado(): Observable<ResponseAudio> {
    return this.http.get<ResponseAudio>(`${this.baseUrl}/musica/listado`).pipe(tap(resp => { if (resp.success !== false) { this.canciones = resp.data } }))
  }

  //Para Pagina de Faqs
  get resultFaqs() {
    return [...this.faqs];
  }


  getListadoFaqs(): Observable<ResponseFaqs> {
    return this.http.get<ResponseFaqs>(`${this.baseUrl}/faq/listado`).pipe(tap(resp => { if (resp.success !== false) { this.faqs = resp.data } }))
  }
}

