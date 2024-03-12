import { Component, Renderer2, ElementRef } from '@angular/core';
import { CitasService } from '../services/citas.service';
import * as interfaces from '../interfaces/citas.interface';
import { NgbTimepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { tap, zip } from 'rxjs';
// import { FormControl,  } from '@angular/forms';

@Component({
  selector: 'app-param-citas',
  templateUrl: './param-citas.component.html',
  styleUrls: ['./param-citas.component.scss']
})
export class ParamCitasComponent {
  divCount = 0;
  horas:interfaces.Horario = {};//: interfaces.Horario = {l: [], m: [], x: [], j: [], v: [], s: []};
  horariosDias: interfaces.HorarioDia[] = [];
  horarioMostrar: interfaces.HorarioDia[] = [];
  horasMostrar: string[] = [];
  isHoraEntradaSalida: boolean[] = [];
  horaValida: boolean;
  intervalId: any;
  aLaVezValido: boolean;

  diaSeleccionado = 'l';
  // selectedButton: string = 'lunes'

  currentHour = new Date();
  time = { hour: this.currentHour.getHours(), minute: this.currentHour.getMinutes() };


  aLaVezForm: FormGroup = new FormGroup({
    nALaVez: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
  });


  // diasSemana = ['l', 'm', 'x', 'j', 'v', 's'];

  diasSemana = [
    {dia: 'lunes', cod : 'l'},
    {dia: 'martes', cod : 'm'},
    {dia: 'miércoles', cod : 'x'},
    {dia: 'jueves', cod : 'j'},
    {dia: 'viernes', cod : 'v'},
    {dia: 'sábado', cod : 's'},
  ]

  constructor(
    private relojillo: NgbTimepickerConfig,
    private renderer: Renderer2,
    private el: ElementRef,
    private citasService: CitasService,
  ) {}

  ngOnInit() {

    this.traerHoras().subscribe(() => {
      this.cargarDia(this.diaSeleccionado);

      this.intervalId = setInterval(() => {
        this.checkTime();
      }, 250);
    });

  }

  formatHora(time: any) {
    let t = {
      hour: '',
      minute: ''
    };

    t.hour = time.hour < 10 ? '0' + time.hour : time.hour;
    t.minute = time.minute < 10 ? '0' + time.minute : time.minute;

    return t;
  }


  checkTime() {
    const formatedTime = this.formatHora(this.time);
    const cTime = formatedTime.hour + ':' + formatedTime.minute + ':00';
    this.horaValida = false;

    this.horarioMostrar.forEach(h => {
      if (h.hEntrada <= cTime && h.hSalida > cTime) {
        this.horaValida = true;
        return;
      }
    });
  }


  traerHoras() {

    return zip([this.citasService.fetchHorasCitas(), this.citasService.fetchHorarios()])
      .pipe(tap(([horasCitasResp, horariosResp]) => {

        if (horasCitasResp.success && horariosResp.success) {
          this.horas = horasCitasResp.horas;
          this.horariosDias = horariosResp.data;
        }
        else {
          // TODO cartelito de fallo
        }

      }));
  }


  quitar(index: number) {

    this.citasService.deleteHoraCita(this.horasMostrar[index] + ':00').subscribe(resp => {
      if (resp.success) {

        this.traerHoras().subscribe();
      }
      else {

        // TODO cartelito de fallo
      }
    });
    this.horasMostrar.splice(index, 1);
    this.isHoraEntradaSalida.splice(index, 1);
  }


  anadirHora(dia: string) {
    const formatedTime = this.formatHora(this.time);
    // const cTime = formatedTime.hour + ':' + formatedTime.minute + ':00';
    const horaAnadir = formatedTime.hour + ':' + formatedTime.minute;
    // let anadir = true;

    // this.horasMostrar.map(hora => {if (hora == horaAnadir) {anadir = false; return;}});

    this.citasService.insertHoraCita(this.diaSeleccionado, horaAnadir + ':00').subscribe(resp => {

      if (resp.success) {
        // this.horas.push(this.time.hour + ':' + this.time.minute);
        // this.horas.sort((a, b) => {
        //   const time1 = new Date("1970-01-01T" + a + ":00Z");
        //   const time2 = new Date("1970-01-01T" + b + ":00Z");

        //   return time1.getTime() - time2.getTime();
        // });

        this.traerHoras().subscribe(() => {

          this.cargarDia(this.diaSeleccionado);
        });
      }
      else {

        //TODO cartelito de fallo
      }
    });
  }


  onDiaChange(dia: string) {
    this.diaSeleccionado = dia;
    this.cargarDia(dia);
  }


  cargarDia(dia: string) {
    let horas: string[] = [];
    this.horasMostrar.length = 0;
    this.isHoraEntradaSalida.length = 0;

    for (const key in this.horas) {
      if (dia == key) {
        horas = this.horas[key];
        this.horarioMostrar = this.horariosDias.filter(dia => {return dia.codDia == key});
      }
    }

    this.horarioMostrar.forEach(hEntradaSalida => {
      this.horasMostrar.push(hEntradaSalida.hEntrada.slice(0, -3));
      this.isHoraEntradaSalida.push(true);

      horas.forEach(hora => {
        if (hEntradaSalida.hEntrada <= hora && hEntradaSalida.hSalida > hora) {
          this.horasMostrar.push(hora.slice(0, -3));
          this.isHoraEntradaSalida.push(false);
        }
      });

      this.horasMostrar.push(hEntradaSalida.hSalida.slice(0, -3));
      this.isHoraEntradaSalida.push(true);
    });
  }


  updateCitasALavez() {
    if (this.aLaVezForm.valid) {
      return
    }
  }
}
