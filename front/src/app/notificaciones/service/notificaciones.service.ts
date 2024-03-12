import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Notificaciones } from '../interface/notificaciones';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {

  constructor(private http: HttpClient) {
    this.comprobarPermisos = new Subject<boolean>();
   }

  private baseURL: string = environment.baseUrl+"/api/notificacion";
  comprobarPermisos: Subject<boolean>

  crearNotificacionesAdministradores(contenido:FormData): Observable<any> {
    return this.http.post<any>(`${this.baseURL}/crearNotificacionAdministradores`, contenido);
  }


  mostrarNotificacionUsuario(idUser:any): Observable<any> {
    return this.http.get<Notificaciones[]>(`${this.baseURL}/mostrarNotificacionUsuario/${idUser}`);
  }

  getCantidadNotificicacionUser(idUser:any): Observable<any> {
    return this.http.get<number>(`${this.baseURL}/getNotificacionCantidad/${idUser}`);
  }

  notificacionLeida(idNotificacion:any): Observable<any> {
    return this.http.put<any>(`${this.baseURL}/notificacionLeida/${idNotificacion}`, {
      boleano: true
    });
  }

  postcrearNotificacionAceptarUsuario(contenido: Notificaciones): Observable<any> {
    return this.http.post<any>(`${this.baseURL}/crearNotificacionAceptarUsuario`, {
      idUser: contenido.propietario,
      idImagenPeticion: contenido.galeriaPeticionID
    });
  }

  postcrearNotificacionRechazarUsuario(contenido: Notificaciones): Observable<any> {
    return this.http.post<any>(`${this.baseURL}/crearNotificacionRechazarUsuario`, {
      idUser: contenido.propietario,
      idImagenPeticion: contenido.galeriaPeticionID
    });
  }
  deleteNotificacion(idNotificacion: any): Observable<any> {
    return this.http.delete<any>(`${this.baseURL}/borrarNotificacion/${idNotificacion}`);
  }
}
