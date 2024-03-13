import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from './shared/services/alerta-error.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'front';
  alertMessage: string="";
  constructor(public router: Router, private route: ActivatedRoute, private alertService:AlertService,public dialog: MatDialog) { }

  ngOnInit() {

    this.alertService.alertMessage.subscribe(message => {this.alertMessage = message
      setTimeout(() => this.alertMessage = "", 10000)});
      
  }
}
