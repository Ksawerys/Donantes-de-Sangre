import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Galeria } from '../interface/galeria';
import { Observable, Subject } from 'rxjs';
import { PeticionGaleria } from '../interface/peticion-galeria';
import { environment } from 'src/environment/environment';
@Injectable({
  providedIn: 'root'
})
export class GaleriaService {
  private baseURL: string = environment.baseUrl+"/api/galeria";
  comprobarPermisos: Subject<boolean>
  /* https://www.c-sharpcorner.com/article/easily-share-data-between-two-unrelated-components-in-angular/ */
  /* https://stackoverflow.com/a/51992202 */
  constructor(private http: HttpClient) {
    this.comprobarPermisos = new Subject<boolean>();
  }

  getGaleria_Imagenes(): Observable<Galeria[]> {
    return this.http.get<Galeria[]>(`${this.baseURL}/mostrarGaleria_Imagenes`);
  }

  getPeticionGaleria_Imagen(peticionImagenID:any): Observable<PeticionGaleria> {
    return this.http.get<PeticionGaleria>(`${this.baseURL}/mostrarPeticionGaleria/${peticionImagenID}`);
  }

  subirFoto(archivo:FormData): Observable<FormData> {
    return this.http.post<any>(`${this.baseURL}/insertarGaleria_imagen`, archivo);
  }

  subirPeticionFoto(archivo:FormData): Observable<any> {
    return this.http.post<any>(`${this.baseURL}/peticion_subidaFoto`, archivo);
  }

  mandarCorreoAdministradoresPeticion(peticionImagenID:any): Observable<any> {
    return this.http.get<any>(`${this.baseURL}/mandarCorreo_fotoPeticion/${peticionImagenID}`);
  }

  mandarCorreoAceptacion(peticionImagenID:any): Observable<any> {
    return this.http.get<any>(`${this.baseURL}/mandarCorreo_aceptacionPeticion/${peticionImagenID}`);
  }

  mandarCorreoRechazo(peticionImagenID:any): Observable<any> {
    return this.http.get<any>(`${this.baseURL}/mandarCorreo_rechazoPeticion/${peticionImagenID}`);
  }

  borrarImagenes(id:any): Observable<any>{
    return this.http.delete<any>(`${this.baseURL}/borrarGaleria_Imagen/${id}`);
  }

  aceptarPeticionFoto(id:any): Observable<any>{
    return this.http.put<any>(`${this.baseURL}/aceptarPeticionFoto/${id}`, null);
  }

  rechazarPeticionFoto(id:any): Observable<any>{
    return this.http.put<any>(`${this.baseURL}/rechazarPeticionFoto/${id}`, null);
  }


}
