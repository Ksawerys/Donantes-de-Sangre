import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environment/environment';
import { Email } from '../interfaces/shared.interface';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  baseUrl = environment.baseUrl + '/api';
  comprobarPermisos: Subject<boolean>;
  citaPedida: Subject<number>;
  /* https://www.c-sharpcorner.com/article/easily-share-data-between-two-unrelated-components-in-angular/ */
  /* https://stackoverflow.com/a/51992202 */


  constructor(private http: HttpClient) {
    this.comprobarPermisos = new Subject<boolean>();
    this.citaPedida = new Subject<number>();
  }

  //Alicia
  suscripcionNewsletter(email: Email): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/suscripcionNewsletter`, email);
  }
}
