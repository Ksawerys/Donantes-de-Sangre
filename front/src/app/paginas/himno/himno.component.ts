//Todo Isa
import { Component, OnInit } from '@angular/core';
import { PaginasService } from '../services/paginas.service';

@Component({
  selector: 'app-himno',
  templateUrl: './himno.component.html',
  styleUrls: ['./himno.component.scss']
})
export class HimnoComponent implements OnInit {
  letra: String[]=[];

  constructor(private PaginasService: PaginasService) {
  }

  ngOnInit() {
    this.PaginasService.getListado().subscribe((res) => {
      if (res.success !== false) {
        res.data.map(c => this.letra.push(c.letra));

      }
    });
  }
  get resultado() {
    return this.PaginasService.result;
  }

}
