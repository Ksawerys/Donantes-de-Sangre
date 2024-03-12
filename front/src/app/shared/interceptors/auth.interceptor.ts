import { Injectable } from '@angular/core';
import jwtDecode from 'jwt-decode';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((requestError: HttpErrorResponse) => {
        if (requestError && requestError.status === 401) {
          const token : {id: number, iat: number, exp: number} = jwtDecode(JSON.parse(localStorage.getItem('user')!).token);
          
          const fechaExpiracion = new Date(0);
          fechaExpiracion.setUTCSeconds(token.exp);

          const ahora = new Date();

          setTimeout(() => {
            this.authService.tokenExpirado.next(fechaExpiracion < ahora);
          }, 350);
        }

        return throwError(requestError)  as Observable<HttpEvent<unknown>>;
      })
    );
  }
}
