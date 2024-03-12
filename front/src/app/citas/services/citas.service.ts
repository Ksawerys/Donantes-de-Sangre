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
    const header = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-token': JSON.parse(localStorage.getItem('user')!).token
      })
    };

    return this.httpPedirCita.get<interfaces.HorarioCitasResponse>(this.pedirCitaUrl
      + '/gethorasdisponibles/' + fecha, header).pipe(tap(citas => this._citasReservadas = citas));
  }

  // fetchHorarioCitas() {
  //   return this.httpPedirCita.get<interfaces.HorarioCitasResponse>(this.pedirCitaUrl
  //     + '/gethorariocitas').pipe(tap(horas => this._horasCitas = horas));
  // }

  insertCita(id: string, fecha: string, donacion: string) {
    const header = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-token': JSON.parse(localStorage.getItem('user')!).token
      })
    };

    return this.httpPedirCita.post<interfaces.SuccessMsgResponse>(this.pedirCitaUrl
      + '/pedircita', {id: id, fecha: fecha, donacion: donacion}, header);
  }


  mandarCorreo(id:string, fecha: string, donacion: string) {
    const header = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-token': JSON.parse(localStorage.getItem('user')!).token
      })
    };

    return this.httpPedirCita.post<interfaces.SuccessMsgResponse>(this.pedirCitaUrl
      + '/mandarcorreocita', {id: id, fecha: fecha, donacion: donacion}, header);
  }


  fetchCitasPendientes() {
    const header = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-token': JSON.parse(localStorage.getItem('user')!).token
      })
    };

    return this.httpPedirCita.get<interfaces.FetchCitasAdminResponse>(this.pedirCitaUrl
      + '/getcitaspendientes', header).pipe(tap(resp => {this._citasPendientes = resp.citas;}));
  }


  fetchCitasPasadas() {
    const header = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-token': JSON.parse(localStorage.getItem('user')!).token
      })
    };

    return this.httpPedirCita.get<interfaces.FetchCitasAdminResponse>(this.pedirCitaUrl
      + '/getcitaspasadas', header).pipe(tap(resp => {this._citasPasadas = resp.citas;}));
  }


  fetchCitaPendienteUser(id: string) {
    const header = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-token': JSON.parse(localStorage.getItem('user')!).token
      })
    };

    return this.httpPedirCita.get<interfaces.FetchCitasResponse>(this.pedirCitaUrl
      + '/getcitapendienteuser/' + id, header).pipe(tap(resp => {this._citasPendientesUser = resp.citas;}));
  }


  fetchCitasPasadasUser(id: string) {
    const header = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-token': JSON.parse(localStorage.getItem('user')!).token
      })
    };

    return this.httpPedirCita.get<interfaces.FetchCitasResponse>(this.pedirCitaUrl
      + '/getcitaspasadasuser/' + id, header).pipe(tap(resp => {this._citasPasadasUser = resp.citas;}));
  }


  cancelarCita(id: string) {
    const header = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-token': JSON.parse(localStorage.getItem('user')!).token
      })
    };

    return this.httpPedirCita.put<interfaces.CancelarCitaResponse>(this.pedirCitaUrl
      + '/cancelarcita/', {id: id}, header);
  }


  compHaPedidoCita(id: string) {
    const header = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-token': JSON.parse(localStorage.getItem('user')!).token
      })
    };

    return this.httpPedirCita.get<interfaces.CancelarCitaResponse>(this.pedirCitaUrl +
      '/yatienecita/' + id, header);
  }


  aplazarCita(id: string, fechaAntigua: string, fechaCita: string) {
    const header = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-token': JSON.parse(localStorage.getItem('user')!).token
      })
    };

    const body = {
      id: id,
      fechaAntigua: fechaAntigua,
      fechaActual: fechaCita,
    };

    return this.httpPedirCita.put<interfaces.CancelarCitaResponse>(this.pedirCitaUrl +
      '/aplazarcita', body, header);
  }


  confirmarHaDonado(id: string, haDonado: number) {
    const header = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-token': JSON.parse(localStorage.getItem('user')!).token
      })
    };

    return this.httpPedirCita.put<interfaces.CancelarCitaResponse>(this.pedirCitaUrl +
      '/updatehadonado', {id: id, haDonado: haDonado}, header);
  }


  updateNumPersonas(nPersonas: number) {
    const header = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-token': JSON.parse(localStorage.getItem('user')!).token
      })
    };

    return this.httpPedirCita.put<interfaces.CancelarCitaResponse>(this.pedirCitaUrl +
      'updatenumpersonascita', {nPersonas: nPersonas}, header);
  }


  insertHoraCita(codDia: string, hora: string) {
    const header = { 
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-token': JSON.parse(localStorage.getItem('user')!).token
      })
    };

    return this.httpPedirCita.post<interfaces.CancelarCitaResponse>(this.pedirCitaUrl +
      '/inserthoracita', {hora: hora, codDia: codDia}, header);
  }


  deleteHoraCita(hora: string) {
    const header = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-token': JSON.parse(localStorage.getItem('user')!).token
      })
    };

    return this.httpPedirCita.delete<interfaces.CancelarCitaResponse>(this.pedirCitaUrl +
      '/deletehoracita/' + hora, header);
  }


  fetchHorasCitas() {
    const header = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-token': JSON.parse(localStorage.getItem('user')!).token
      })
    };

    return this.httpPedirCita.get<interfaces.getHoraCitaResponse>(this.pedirCitaUrl +
      '/gethorascitas', header);
  }


  fetchHorarios() {
    const header = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-token': JSON.parse(localStorage.getItem('user')!).token
      })
    };

    return this.httpPedirCita.get<interfaces.getHorarioResponse>(this.pedirCitaUrl +
      '/gethorarios', header);
  }

  
  updateCitasALaVez(nPersCitas: number) {
    const header = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-token': JSON.parse(localStorage.getItem('user')!).token
      })
    };

    return this.httpPedirCita.put<interfaces.getHorarioResponse>(this.pedirCitaUrl +
      '/updatecitasalavez', {nCitas: nPersCitas}, header);
  }


  getCitasALaVez() {
    const header = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-token': JSON.parse(localStorage.getItem('user')!).token
      })
    };

    return this.httpPedirCita.get<interfaces.GetALaVezResponse>(this.pedirCitaUrl +
      '/getcitasalavez', header);
  }


  //Isa
  getUltimaCitaUser(id: string) {
    const header = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-token': JSON.parse(localStorage.getItem('user')!).token
      })
    };

    return this.httpPedirCita.get<interfaces.ResponseCitaInfo>(this.pedirCitaUrl +
      '/obtenerultima/' + id, header);
  }
}
