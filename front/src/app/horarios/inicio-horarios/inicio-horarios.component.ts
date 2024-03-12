import { Time } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HorariosService } from '../services/horarios.service';
import { Dia, Hora, Horario, HorarioMostrar } from '../interfaces/horario.interfaces';

@Component({
  selector: 'app-inicio-horarios',
  templateUrl: './inicio-horarios.component.html',
  styleUrls: ['./inicio-horarios.component.scss']
})
export class InicioHorariosComponent implements OnInit {

  horariosMostrar: HorarioMostrar[] = [];


  constructor(private horariosService: HorariosService) { }


  ngOnInit() {
    this.horariosService.getHorarios().subscribe(resp => {
      if (resp.success) this.iniciarHorariosMostrar(resp.data);
    });
  }


  iniciarHorariosMostrar(datos: Horario[]) {
    let horas: Hora[] = []; // Horas de entrada y de salida de cada horario.
    let diasHora: Horario[] = [];

    this.horariosMostrar = [];
    datos.forEach(horario => { // Recojo los distintos grupos de horas
      if (!horas.find(h => h.entrada == horario.hEntrada && h.salida == horario.hSalida))
        horas.push({ "entrada": horario.hEntrada, "salida": horario.hSalida });
    });

    for (let i = 0; i < horas.length; i++) { // Recojo los días que tienen ese grupo de horas
      diasHora = datos.filter(h => h.hEntrada == horas[i].entrada && h.hSalida == horas[i].salida);
      const hMostrar: HorarioMostrar = this.crearHorarioMostrar(diasHora, horas[i].entrada, horas[i].salida);
      this.horariosMostrar.push(hMostrar);
    }

    this.ordenarDias();
  }


  crearHorarioMostrar(diasHora: Horario[], hEntrada: Time, hSalida: Time) {
    let listaDias: Dia[] = []; //Días de un horario concreto.
    let idDia: number;

    diasHora.forEach(dia => {
      idDia = dia.id;
      listaDias.push({ id: idDia, nombre: dia.dia, letra: dia.codDia, seleccionado: true});
    });

    return {
      dias: listaDias,
      hEntrada: hEntrada,
      hSalida: hSalida
    };
  }


  ordenarDias() {
    const sorter: { [dia: string]: number } = {
      "lunes": 1,
      "martes": 2,
      "miércoles": 3,
      "jueves": 4,
      "viernes": 5
    }

    this.horariosMostrar.forEach(horario => {
      horario.dias.sort(function sortByDay(a, b) {
        let dia1 = a.nombre.toLowerCase();
        let dia2 = b.nombre.toLowerCase();
        return sorter[dia1] - sorter[dia2];
      });
    })
  }
}
