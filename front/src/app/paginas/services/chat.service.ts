import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environment/environment';
import { Observable, tap } from 'rxjs';
import { Mensaje, ResponseMensajes, ResponseModerarUser, ResponseEstado,ModerarUser } from '../interfaces/paginas.interface';
import { Check } from '../interfaces/paginas.interface';
@Injectable({
  providedIn: 'root'
})
export class ChatService {
  baseUrl = environment.baseUrl;
  private mensajes: Mensaje[];
  private listaConectados: String[];
  private bloqueados: ModerarUser[];
  private desbloqueados: ModerarUser[];
  private checksDesbloqueados: Check[];
  private aux: number;
  private cont: number;
  private checksBloqueados: Check[];

  constructor(private http: HttpClient) {
    this.mensajes = [];
    this.listaConectados = [];
    this.bloqueados = [];
    this.desbloqueados = [];
    this.aux = 0;
    this.cont = 0;
    this.checksBloqueados = [];
    this.checksDesbloqueados = [];
  }
  get resultMensajes() {
    return [...this.mensajes];
  }
  get resultConectados() {
    return [...this.listaConectados];
  }
  get resultBloqueados() {
    return [...this.bloqueados];
  }
  get resultDesbloqueados() {
    return [...this.desbloqueados];
  }
  getListadoMensajes(): Observable<ResponseMensajes> {
    const header = {
      headers: new HttpHeaders({
        'x-token': JSON.parse(localStorage.getItem('user')!).token
      })
    };
    return this.http.get<ResponseMensajes>(`${this.baseUrl}/api/chat/listado`, header).pipe(tap(resp => { if (resp.success !== false) { this.mensajes = resp.data } }))
  }
  getListadoBloqueados(): Observable<ResponseModerarUser> {
    const header = {
      headers: new HttpHeaders({
        'x-token': JSON.parse(localStorage.getItem('user')!).token
      })
    };
    return this.http.get<ResponseModerarUser>(`${this.baseUrl}/api/chat/listadobloqueados`, header).pipe(tap(resp => { if (resp.success !== false) { this.bloqueados = resp.data } }))
  }
  getListadoDesbloqueados(): Observable<ResponseModerarUser> {
    const header = {
      headers: new HttpHeaders({
        'x-token': JSON.parse(localStorage.getItem('user')!).token
      })
    };
    return this.http.get<ResponseModerarUser>(`${this.baseUrl}/api/chat/listadodesbloqueados`, header).pipe(tap(resp => { if (resp.success !== false) { this.desbloqueados = resp.data } }))
  }
  comprobarEstado(): Observable<ResponseEstado> {
    const user = localStorage.getItem('user')!;
    const header = {
      headers: new HttpHeaders({
        'x-token': JSON.parse(localStorage.getItem('user')!).token
      })
    };
    return this.http.post<ResponseEstado>(`${this.baseUrl}/api/chat/comprobarestado`, { id: JSON.parse(user).id }, header);
  }

  agregarMensaje(mensaje: Mensaje): void {
    this.mensajes.push(mensaje);

  }
  setListaConectados(lista: string[]) {
    this.listaConectados = lista;
  }
  cambiarUsersBloqueados(users: String[]) {
    let listaUser=this.desbloqueados.filter((d) => users.toString().includes(d.id));
    let lista = this.desbloqueados.filter((d) => !users.toString().includes(d.id));

    this.desbloqueados = lista;
    listaUser.forEach(u => {
      this.bloqueados.push(u),
        this.borrarCheckDesbloqueados(u.id),
        this.addCheckBloqueados(u.id)
    });
  }

  cambiarUsersDesbloqueados(users: String[]) {
    let listaUser=this.bloqueados.filter((d) => users.toString().includes(d.id));
    let lista = this.bloqueados.filter((d) => !users.toString().includes(d.id));

    this.bloqueados = lista;
    listaUser.forEach(u => {
      this.desbloqueados.push(u),
        this.borrarCheckBloqueados(u.id),
        this.addCheckDesbloqueados(u.id)
    });
  }
  borrarTodo() {
    this.mensajes = [];
  }
  ActualizarListaMensajes(res: Mensaje[]) {
    this.mensajes = res;
  }
  get resultCheckBloqueados() {
    return [...this.checksBloqueados];
  }
  get resultCheckDesbloqueados() {
    return [...this.checksDesbloqueados];
  }

  generarChecksBloqueados() {
    if (this.aux == 0) {
      for (let index = 0; index < this.bloqueados.length; index++) {
        this.checksBloqueados.push({ id: this.bloqueados[index].id, marcado: false });
      }
      this.aux++;
    }
  }
  generarChecksDesbloqueados() {
    if (this.cont == 0) {
      for (let index = 0; index < this.desbloqueados.length; index++) {
        this.checksDesbloqueados.push({ id: this.desbloqueados[index].id, marcado: false });
      }
      this.cont++;
    }
  }
  addCheckDesbloqueados(u: String) {
    this.checksDesbloqueados.push({ id: u, marcado: false });
  }
  addCheckBloqueados(u: String) {
    this.checksBloqueados.push({ id: u, marcado: false });
  }
  borrarCheckBloqueados(u: String) {
    let lista = this.checksBloqueados.filter(c => c.id != u);
    this.checksBloqueados = lista;
  }
  borrarCheckDesbloqueados(u: String) {
    let lista = this.checksDesbloqueados.filter(c => c.id != u);
    this.checksDesbloqueados = lista;
  }

  marcarCheck(id: string, modal: number): void {
    if (modal == 1) {
      let posicion = this.checksDesbloqueados.findIndex(c => c.id == id);
      this.checksDesbloqueados[posicion]["marcado"] = true;
    } else if (modal == 2) {
      let posicion = this.checksBloqueados.findIndex(c => c.id == id);
      this.checksBloqueados[posicion]["marcado"] = true;
    };
  }
  desmarcarCheck(id: string, modal: number): void {
    if (modal == 1) {
      let posicion = this.checksDesbloqueados.findIndex(c => c.id == id);
      this.checksDesbloqueados[posicion]["marcado"] = false
    } else if (modal == 2) {
      let posicion = this.checksBloqueados.findIndex(c => c.id == id);
      this.checksBloqueados[posicion]["marcado"] = false
    };
  }
  desmarcarCheckSeleccionados(modal: number): void {
    if (modal == 1) {
      this.checksBloqueados.forEach(c => {
        c.marcado = false;
      });
    } else if (modal == 2) {
      this.checksDesbloqueados.forEach(c => {
        c.marcado = false;
      });
    }
  };
}
