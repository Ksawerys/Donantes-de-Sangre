import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TelefonoResponse, Telefono, TelefonosResponse, TelefonoDeleteResponse } from '../interfaces/telefonos.interfaces';

@Injectable({
  providedIn: 'root'
})
export class TelefonosService {

  baseUrl = environment.baseUrl + '/api'


  constructor(private http: HttpClient) { }


  getTelefonos(): Observable<TelefonosResponse> {
    return this.http.get<TelefonosResponse>(`${this.baseUrl}/getTelefonos`);
  }


  insertOrUpdateTfno(datos: Telefono): Observable<TelefonoResponse> {
    return this.http.put<TelefonoResponse>(`${this.baseUrl}/insertOrUpdateTfno`, datos, { params: { auth: 'true' } });
  }


  deleteTfno(id: number): Observable<TelefonoDeleteResponse> {
    return this.http.delete<TelefonoDeleteResponse>(`${this.baseUrl}/deleteTfno/${id}`, { params: { auth: 'true' } });
  }
}
