import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { Horario, HorarioDeleteResponse, HorarioResponse } from '../interfaces/horario.interfaces';

@Injectable({
  providedIn: 'root'
})
export class HorariosService {

  baseUrl = environment.baseUrl + '/api';


  constructor(private http: HttpClient) { }


  getHorarios(): Observable<HorarioResponse> {
    return this.http.get<HorarioResponse>(`${this.baseUrl}/getHorarios`);
  }


  insertHorarios(horarios: Horario[]): Observable<HorarioResponse> {
    const header = { headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'x-token': JSON.parse(localStorage.getItem('user')!).token
    })};

    return this.http.post<HorarioResponse>(`${this.baseUrl}/insertHorarios`, horarios, header);
  }


  updateHorarios(hGuardar: Horario[], hBorrar: number[]): Observable<HorarioResponse> {
    const header = { headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'x-token': JSON.parse(localStorage.getItem('user')!).token
    })};

    return this.http.put<HorarioResponse>(`${this.baseUrl}/updateHorarios`,
      { hGuardar: hGuardar, hBorrar: hBorrar }, header
    );
  }



  deleteHorarios(horariosBorrar: Horario[]): Observable<HorarioDeleteResponse> {
    const header = { headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'x-token': JSON.parse(localStorage.getItem('user')!).token
    })};

    //He puesto un put porque necesito borrar varias cosas y en un delete no puedes enviar payload.
    return this.http.put<HorarioDeleteResponse>(`${this.baseUrl}/deleteHorarios`, horariosBorrar, header);
  }
}
