import { Component, OnInit } from '@angular/core';
import { Telefono } from '../interfaces/telefonos.interfaces';
import { TelefonosService } from '../services/telefonos.service';

@Component({
  selector: 'app-inicio-tfns',
  templateUrl: './inicio-tfns.component.html',
  styleUrls: ['./inicio-tfns.component.scss']
})
export class InicioTfnsComponent implements OnInit {

  telefonos: Telefono[] = [];


  constructor(private tfnosService: TelefonosService) {}


  ngOnInit() {
    this.tfnosService.getTelefonos().subscribe(resp => {
      if (resp.success) this.telefonos = resp.data;
    });
  }
}
