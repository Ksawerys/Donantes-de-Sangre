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
    return this.http.post<HorarioResponse>(`${this.baseUrl}/insertHorarios`, horarios, { params: { auth: 'true' } });
  }


  updateHorarios(hGuardar: Horario[], hBorrar: number[]): Observable<HorarioResponse> {
    return this.http.put<HorarioResponse>(`${this.baseUrl}/updateHorarios`,
      { hGuardar: hGuardar, hBorrar: hBorrar }, { params: { auth: 'true' } });
  }



  deleteHorarios(horariosBorrar: Horario[]): Observable<HorarioDeleteResponse> {
    //He puesto un put porque necesito borrar varias cosas y en un delete no puedes enviar payload.
    return this.http.put<HorarioDeleteResponse>(`${this.baseUrl}/deleteHorarios`, horariosBorrar, { params: { auth: 'true' } });
  }
}
