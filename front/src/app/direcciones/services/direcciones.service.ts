import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Direccion, DireccionResponse, DireccionesResponse } from '../interfaces/direcciones.interfaces';

@Injectable({
  providedIn: 'root'
})
export class DireccionesService {

  baseUrl = environment.baseUrl + '/api';


  constructor(private http: HttpClient) { }


  getDirecciones(): Observable<DireccionesResponse> {
    return this.http.get<DireccionesResponse>(`${this.baseUrl}/getDirecciones`);
  }


  insertOrUpdateDir(datos: Direccion): Observable<DireccionResponse> {
    
    return this.http.put<DireccionResponse>(`${this.baseUrl}/insertOrUpdateDir`, datos, {params: {auth: true}});
  }
}
