import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http'
import { Observable } from 'rxjs';
import { Pregunta } from '../interface/pregunta';
import { environment } from 'src/environment/environment';
@Injectable({
  providedIn: 'root'
})
export class aptosangreService {

  constructor(private http: HttpClient) { }

  public preguntasEnviadas: any;

  getPreguntas(): Observable<Pregunta[]> {
    return this.http.get<Pregunta[]>(environment.baseUrl+'/api/test-apto/mostrarPreguntas');
  }

}
