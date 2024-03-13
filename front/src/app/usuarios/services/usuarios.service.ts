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
    const id = JSON.parse(localStorage.getItem('user')!).id;

    return this.httpUsuarios.get<interfaces.FetchUserInfoResponse>(this.usuariosUrl
      + '/getinfouser/' + id, { params: { auth: 'true' } }).pipe(tap(info => this._infoUser = info));
  }


  updateUserPerfil(userInfo: interfaces.UserInfo) {
    userInfo.codSeguridad = JSON.parse(localStorage.getItem('user')!).codSeguridad;

    return this.httpUsuarios.put<interfaces.UpdateUserResponse>(this.usuariosUrl
      + '/updateuserperfil', userInfo, { params: { auth: 'true' } });
  }


  updateUserAdmin(userInfo: {nDonante: string, gSanguineo: string, id?: string}) {
    userInfo.id = JSON.parse(localStorage.getItem('user')!).id
    return this.httpUsuarios.put<interfaces.UpdateUserResponse>(this.usuariosUrl
      + '/updateuseradmin', userInfo, { params: { auth: 'true' } });
  }


  fetchUsers() {
    return this.httpUsuarios.get<interfaces.fetchUsersResponse>(this.usuariosUrl
      + '/getinfousers', { params: { auth: 'true' } });
  }

}