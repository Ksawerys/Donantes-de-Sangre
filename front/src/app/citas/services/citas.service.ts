import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, ɵɵresolveBody } from '@angular/core';
import { Subject, tap } from 'rxjs';
import { environment } from 'src/environment/environment';
import * as interfaces from '../interfaces/citas.interface';


@Injectable({
  providedIn: 'root'
})
export class CitasService {
  private pedirCitaUrl = `${environment.baseUrl}/api/citas`;
  private _horasCitas: any;
  private _citasReservadas: any;
  private _citasPendientes: interfaces.CitaAdmin[];
  private _citasPasadas: interfaces.CitaAdmin[];
  private _citasPendientesUser: interfaces.Cita[];
  private _citasPasadasUser: interfaces.Cita[];

  idCita: Subject<string>;
  diaCita: Subject<string>;
  horaCita: Subject<string>;
  codAccion: Subject<number>;
  
  constructor(private httpPedirCita: HttpClient) {
    this.idCita = new Subject<string>();
    this.diaCita = new Subject<string>();
    this.horaCita = new Subject<string>();
    this.codAccion = new Subject<number>();
  }

  fetchHorasDisponibles(fecha: string) {
    
    return this.httpPedirCita.get<interfaces.HorarioCitasResponse>(this.pedirCitaUrl
      + '/gethorasdisponibles/' + fecha,{params: {auth: true}}).pipe(tap(citas => this._citasReservadas = citas));
  }

  // fetchHorarioCitas() {
  //   return this.httpPedirCita.get<interfaces.HorarioCitasResponse>(this.pedirCitaUrl
  //     + '/gethorariocitas').pipe(tap(horas => this._horasCitas = horas));
  // }

  insertCita(id: string, fecha: string, donacion: string) {
    
    return this.httpPedirCita.post<interfaces.SuccessMsgResponse>(this.pedirCitaUrl
      + '/pedircita', {id: id, fecha: fecha, donacion: donacion}, {params: {auth: true}});
  }


  mandarCorreo(id:string, fecha: string, donacion: string) {

    return this.httpPedirCita.post<interfaces.SuccessMsgResponse>(this.pedirCitaUrl
      + '/mandarcorreocita', {id: id, fecha: fecha, donacion: donacion}, {params: {auth: true}});
  }


  fetchCitasPendientes() {

    return this.httpPedirCita.get<interfaces.FetchCitasAdminResponse>(this.pedirCitaUrl
      + '/getcitaspendientes', {params: {auth: true}}).pipe(tap(resp => {this._citasPendientes = resp.citas;}));
  }


  fetchCitasPasadas() {
    
    return this.httpPedirCita.get<interfaces.FetchCitasAdminResponse>(this.pedirCitaUrl
      + '/getcitaspasadas', {params: {auth: true}}).pipe(tap(resp => {this._citasPasadas = resp.citas;}));
  }


  fetchCitaPendienteUser(id: string) {

    return this.httpPedirCita.get<interfaces.FetchCitasResponse>(this.pedirCitaUrl
      + '/getcitapendienteuser/' + id, {params: {auth: true}}).pipe(tap(resp => {this._citasPendientesUser = resp.citas;}));
  }


  fetchCitasPasadasUser(id: string) {

    return this.httpPedirCita.get<interfaces.FetchCitasResponse>(this.pedirCitaUrl
      + '/getcitaspasadasuser/' + id, {params: {auth: true}}).pipe(tap(resp => {this._citasPasadasUser = resp.citas;}));
  }


  cancelarCita(id: string) {

    return this.httpPedirCita.put<interfaces.CancelarCitaResponse>(this.pedirCitaUrl
      + '/cancelarcita/', {id: id}, {params: {auth: true}});
  }


  compHaPedidoCita(id: string) {

    return this.httpPedirCita.get<interfaces.CancelarCitaResponse>(this.pedirCitaUrl +
      '/yatienecita/' + id, {params: {auth: true}});
  }


  aplazarCita(id: string, fechaAntigua: string, fechaCita: string) {

    const body = {
      id: id,
      fechaAntigua: fechaAntigua,
      fechaActual: fechaCita,
    };

    return this.httpPedirCita.put<interfaces.CancelarCitaResponse>(this.pedirCitaUrl +
      '/aplazarcita', body, {params: {auth: true}});
  }


  confirmarHaDonado(id: string, haDonado: number) {

    return this.httpPedirCita.put<interfaces.CancelarCitaResponse>(this.pedirCitaUrl +
      '/updatehadonado', {id: id, haDonado: haDonado}, {params: {auth: true}});
  }


  updateNumPersonas(nPersonas: number) {

    return this.httpPedirCita.put<interfaces.CancelarCitaResponse>(this.pedirCitaUrl +
      'updatenumpersonascita', {nPersonas: nPersonas}, {params: {auth: true}});
  }


  insertHoraCita(codDia: string, hora: string) {

    return this.httpPedirCita.post<interfaces.CancelarCitaResponse>(this.pedirCitaUrl +
      '/inserthoracita', {hora: hora, codDia: codDia}, {params: {auth: true}});
  }


  deleteHoraCita(hora: string) {

    return this.httpPedirCita.delete<interfaces.CancelarCitaResponse>(this.pedirCitaUrl +
      '/deletehoracita/' + hora, {params: {auth: true}});
  }


  fetchHorasCitas() {

    return this.httpPedirCita.get<interfaces.getHoraCitaResponse>(this.pedirCitaUrl +
      '/gethorascitas', {params: {auth: true}});
  }


  fetchHorarios() {
    
    return this.httpPedirCita.get<interfaces.getHorarioResponse>(this.pedirCitaUrl +
      '/gethorarios', {params: {auth: true}});
  }

  
  updateCitasALaVez(nPersCitas: number) {

    return this.httpPedirCita.put<interfaces.getHorarioResponse>(this.pedirCitaUrl +
      '/updatecitasalavez', {nCitas: nPersCitas}, {params: {auth: true}});
  }


  getCitasALaVez() {

    return this.httpPedirCita.get<interfaces.GetALaVezResponse>(this.pedirCitaUrl +
      '/getcitasalavez', {params: {auth: true}});
  }


  //Isa
  getUltimaCitaUser(id: string) {

    return this.httpPedirCita.get<interfaces.ResponseCitaInfo>(this.pedirCitaUrl +
      '/obtenerultima/' + id, {params: {auth: true}});
  }
}
