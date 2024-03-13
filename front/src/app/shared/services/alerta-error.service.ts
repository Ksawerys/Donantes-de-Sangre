import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  alertMessage = new Subject<string>();
  tokenExpired = new Subject<void>();

  setAlertMessage(message: string) {
    this.alertMessage.next(message);
  }

}