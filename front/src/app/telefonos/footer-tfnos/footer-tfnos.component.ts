import { Component, OnInit } from '@angular/core';
import { Telefono } from '../interfaces/telefonos.interfaces';
import { TelefonosService } from '../services/telefonos.service';

@Component({
  selector: 'app-footer-tfnos',
  templateUrl: './footer-tfnos.component.html',
  styleUrls: ['./footer-tfnos.component.scss']
})
export class FooterTfnosComponent  implements OnInit {

  telefonos: Telefono[] = [];


  constructor(private tfnosService: TelefonosService) {}


  ngOnInit() {
    this.tfnosService.getTelefonos().subscribe(resp => {
      if (resp.success) this.telefonos = resp.data;
    });
  }
}
