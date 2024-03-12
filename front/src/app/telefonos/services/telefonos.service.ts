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
    const header = { headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'x-token': JSON.parse(localStorage.getItem('user')!).token
    })};

    return this.http.put<TelefonoResponse>(`${this.baseUrl}/insertOrUpdateTfno`, datos, header);
  }


  deleteTfno(id: number): Observable<TelefonoDeleteResponse> {
    const header = { headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'x-token': JSON.parse(localStorage.getItem('user')!).token
    })};

    return this.http.delete<TelefonoDeleteResponse>(`${this.baseUrl}/deleteTfno/${id}`, header);
  }
}
