import { Observable, tap } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Cargo, CargosResponse, Historia, HistoriaResponse, CargoInsertResponse, IntDeleteResponse, Integrante, IntsJuntaResponse, IntUpdateInsertResponse, CargoDeleteResponse } from '../interfaces/la-hermandad.interface';

@Injectable({
  providedIn: 'root'
})
//Alicia
export class LaHermandadService {

  baseUrl = `${environment.baseUrl}/api`;
  cargos: Cargo[] = [];


  constructor(private http: HttpClient) { }


  addCargo(cargo: Cargo) {
    this.cargos.push(cargo);
  }


  getHistoria(): Observable<HistoriaResponse> {
    return this.http.get<HistoriaResponse>(`${this.baseUrl}/getHistoria`);
  }


  updateHistoria(historia: Historia): Observable<HistoriaResponse> {
    const header = { headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'x-token': JSON.parse(localStorage.getItem('user')!).token
    })};

    return this.http.put<HistoriaResponse>(`${this.baseUrl}/updateHistoria`, historia, header);
  }


  getIntegrantesCargo(): Observable<IntsJuntaResponse> {
    return this.http.get<IntsJuntaResponse>(`${this.baseUrl}/getIntegrantesCargo`);
  }


  getCargosJunta(): Observable<CargosResponse> {
    return this.http.get<CargosResponse>(`${this.baseUrl}/getCargosJunta`)
      .pipe(tap(resp => { if (resp.success) { this.cargos = resp.data } }));
  }


  insertCargo(cargo: Cargo): Observable<CargoInsertResponse> {
    const header = { headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'x-token': JSON.parse(localStorage.getItem('user')!).token
    })};

    return this.http.post<CargoInsertResponse>(`${this.baseUrl}/insertCargo`, cargo, header);
  }


  insertOrUpdateIntegranteJunta(integrante: Integrante): Observable<IntUpdateInsertResponse> {
    const header = { headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'x-token': JSON.parse(localStorage.getItem('user')!).token
    })};

    return this.http.put<IntUpdateInsertResponse>(`${this.baseUrl}/insertOrUpdateIntegranteJunta`, integrante, header);
  }


  deleteCargo(id: number): Observable<CargoDeleteResponse>{
    const header = { headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'x-token': JSON.parse(localStorage.getItem('user')!).token
    })};

    return this.http.delete<CargoDeleteResponse>(`${this.baseUrl}/deleteCargo/${id}`, header)
      .pipe(tap(resp => { if (resp.success) this.cargos.splice(this.cargos.findIndex(c => c.id == resp.data), 1) }));
  }


  deleteIntegranteJunta(id: number): Observable<IntDeleteResponse> {
    const header = { headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'x-token': JSON.parse(localStorage.getItem('user')!).token
    })};

    return this.http.delete<IntDeleteResponse>(`${this.baseUrl}/deleteIntegranteJunta/${id}`, header);
  }
}
