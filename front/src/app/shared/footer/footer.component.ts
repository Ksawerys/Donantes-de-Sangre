import { Component,OnInit } from '@angular/core';
import { ConfigService } from '../../config/services/config.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit{
  habilitado:number;
  constructor(
    private ConfigService:ConfigService,
  ) {
    this.habilitado=0;
   }
  ngOnInit() {
    this.ConfigService.obtenerEstadoChat().subscribe((res) => {this.habilitado=res.data});
  }

}
