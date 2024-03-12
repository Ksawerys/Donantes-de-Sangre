import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { DonacionResponse, AltaResponse } from '../interfaces/stats.interface';

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  private url = `${environment.baseUrl}/api/stats`;


  constructor(private http: HttpClient) {}


  getDonaciones(): Observable<DonacionResponse> {
    return this.http.get<DonacionResponse>(this.url+ '/getDonaciones');
  }


  getAltas(): Observable<AltaResponse> {
    return this.http.get<AltaResponse>(this.url+ '/getAltas');
  }
}
