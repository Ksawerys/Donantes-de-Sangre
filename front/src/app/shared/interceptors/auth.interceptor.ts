import { Injectable } from '@angular/core';
import jwtDecode from 'jwt-decode';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Router } from '@angular/router';
import { AlertService } from '../services/alerta-error.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService,private router: Router, private alertService: AlertService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let peticion = request.clone();
    const param = request.params.get('auth');
    if (param) {
      const t = sessionStorage.getItem('token');
      if (t) {
        peticion = request.clone({
          headers: request.headers.set('x-token', t)
        });
      }
    }
    
    return next.handle(peticion).pipe(
      
      catchError((requestError: HttpErrorResponse) => {
        console.log('--------------------',requestError);
        if (requestError.status === 0) {
          console.log('Error de conexión');
          this.router.navigate(['/error']);
        } else if (![400, 404, 403, 401, 500].includes(requestError.status)) {
          this.alertService.setAlertMessage('Ha ocurrido un error con su petición');
        }
        if (requestError && requestError.status === 401) {
          const token : {id: number, iat: number, exp: number} = jwtDecode(JSON.parse(localStorage.getItem('user')!).token);
          
          const fechaExpiracion = new Date(0);
          fechaExpiracion.setUTCSeconds(token.exp);

          const ahora = new Date();

          setTimeout(() => {
            if (fechaExpiracion < ahora) {
              localStorage.removeItem('user');
              location.reload();
            }
          }, 350);
        }

        return throwError(requestError)  as Observable<HttpEvent<unknown>>;
      })
    ); 
  }
}
//400 404 403 401 500