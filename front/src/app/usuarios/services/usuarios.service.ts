import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as interfaces from '../interfaces/usuarios.interface';
import { environment } from 'src/environment/environment';
import { tap } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private usuariosUrl = `${environment.baseUrl}/api/users`;
  private _infoUser = {};

  constructor(
    private httpUsuarios: HttpClient
  ) {}


  fetchInfoUser() {
    const header = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-token': JSON.parse(localStorage.getItem('user')!).token
      })
    };

    const id = JSON.parse(localStorage.getItem('user')!).id;

    return this.httpUsuarios.get<interfaces.FetchUserInfoResponse>(this.usuariosUrl
      + '/getinfouser/' + id, header).pipe(tap(info => this._infoUser = info));
  }


  updateUserPerfil(userInfo: interfaces.UserInfo) {
    const header = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-token': JSON.parse(localStorage.getItem('user')!).token
      })
    };

    userInfo.codSeguridad = JSON.parse(localStorage.getItem('user')!).codSeguridad;

    return this.httpUsuarios.put<interfaces.UpdateUserResponse>(this.usuariosUrl
      + '/updateuserperfil', userInfo, header);
  }


  updateUserAdmin(userInfo: {nDonante: string, gSanguineo: string, id?: string}) {
    const header = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-token': JSON.parse(localStorage.getItem('user')!).token
      })
    };

    userInfo.id = JSON.parse(localStorage.getItem('user')!).id
    return this.httpUsuarios.put<interfaces.UpdateUserResponse>(this.usuariosUrl
      + '/updateuseradmin', userInfo, header);
  }


  fetchUsers() {
    const header = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-token': JSON.parse(localStorage.getItem('user')!).token
      })
    };

    return this.httpUsuarios.get<interfaces.fetchUsersResponse>(this.usuariosUrl
      + '/getinfousers', header);
  }


}