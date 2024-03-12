import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as interfaces from '../interfaces/auth.interface';
import { map, Observable, of, Subject, tap } from 'rxjs';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authUrl: string = `${environment.baseUrl}/api`; // cambiar en el server // hacer archivo env
  private _auth: interfaces.Auth | undefined;

  tokenExpirado: Subject<boolean>;

  constructor(private httpUsers: HttpClient) {

    this.tokenExpirado = new Subject<boolean>(); 
  }


  login(user: interfaces.UserLogin) {

    return this.httpUsers.post<interfaces.Auth>(this.authUrl + '/login', user)
      .pipe(tap(auth => this._auth = auth));
  }


  registro(user: interfaces.UserRegsitro) {

    return this.httpUsers.post<interfaces.RegistroResponse>(this.authUrl + '/register', user);
  }


  solicitarRecPasswd(email: string) {

    return this.httpUsers.post<interfaces.SolicitarRecPasswdResponse>(this.authUrl
      + '/solicitarrecpasswd', { email: email });
  }


  recuperarPasswd(id: string, cod: string) {

    return this.httpUsers.post<interfaces.RecPasswdResponse>(this.authUrl
      + '/recuperarpasswd/' + id, { cod: cod });
  }


  cambiarPasswd(passwd: string, passwdNueva: string) {
    const header = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-token': JSON.parse(localStorage.getItem('user')!).token
      })
    };

    const user = JSON.parse(localStorage.getItem('user')!);
    const passwds = {
      id: user.id,
      codSeguridad: user.codSeguridad,
      passwd: passwd,
      passwdNueva: passwdNueva
    };

    return this.httpUsers.put<interfaces.RecPasswdResponse>(this.authUrl
      + '/cambiarpasswd', passwds, header);
  }


  puedeModificar(): Observable<boolean> {

    const user = localStorage.getItem('user');

    if (!user) {
      return of(false);

    } else {
      const header = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'x-token' : JSON.parse(localStorage.getItem('user')!).token
        })
      };

      return this.httpUsers.get<interfaces.Auth>(`${this.authUrl}/puedeModificar/${JSON.parse(user).id}`, header)
        .pipe(
          map(auth => {
            if (auth.success) {

              this._auth = auth;
              return true;

            } else {
              return false;
            }
          })
        );
    }
  }

  LoginWithGoogle(credentials: string): Observable<any> {
    const header = new HttpHeaders().set('Content-type', 'application/json');
    return this.httpUsers.post(this.authUrl + "/login_Google", {credentials: credentials}, { headers: header });
  }
}
