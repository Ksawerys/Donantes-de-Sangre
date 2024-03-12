import { Component, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { CitasService } from '../services/citas.service';
import { FormControl, FormGroup, Validators, FormsModule } from '@angular/forms';
import { NgbDateStruct, NgbCalendar, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerComponent } from '../date-picker/date-picker.component';
import { CommonModule } from '@angular/common';
import { Route, Router } from '@angular/router';
import { SharedService } from 'src/app/shared/services/shared.service';



@Component({
  selector: 'app-pedir-cita-paciente',
  templateUrl: './pedir-cita-paciente.component.html',
  styleUrls: ['./pedir-cita-paciente.component.scss'],
})
export class PedirCitaPacienteComponent {

  @Output() onCitaPedida: EventEmitter<boolean> = new EventEmitter();

  fecha: NgbDateStruct;
  sinSeleccionar = true;
  registrado: boolean = false;
  noHayHoras: boolean = false;
  horasDisponibles: string[] = [];
  fechaSeleccionada: string;
  citaPedida: number = -1;

  citaForm: FormGroup = new FormGroup({
    hora: new FormControl('', [Validators.required]),
    donacion: new FormControl('sangre', [Validators.required])
  });


  constructor(
    private pedirCitaHttpService: CitasService,
    private calendar: NgbCalendar,
    private router: Router,
    private sharedService: SharedService
    ) {}

  ngOnInit() {
    this.sinSeleccionar = true;
    this.fecha = this.calendar.getToday();
    this.transFecha(this.fecha);
    this.compRegistro();
  }


  compRegistro() {
     this.registrado = localStorage.getItem('user') != null;
  }


  transFecha(fechaCalendar: NgbDateStruct) {
    this.fechaSeleccionada = this.fecha.year + '-' + this.fecha.month + '-' + this.fecha.day;
  }


  traerHorario() {
    this.pedirCitaHttpService.fetchHorasDisponibles(this.fechaSeleccionada).subscribe(resp => {
      this.horasDisponibles = resp.horas;
      console.log(resp);
      if (this.horasDisponibles.length == 0) this.noHayHoras = true;
    });
  }


  setDia(event: NgbDateStruct) {
    this.fecha = event;
    this.transFecha(this.fecha);
    this.traerHorario();
    this.sinSeleccionar = false;

    // console.log(dow);
  }


  pedirCita() {
    const id = JSON.parse(localStorage.getItem('user') || '{}').id;
    const fechaCita = this.fechaSeleccionada
      + ' ' + this.citaForm.get('hora')?.value + ':00';

    const tipoDonacion = this.citaForm.get('donacion')?.value;

    this.pedirCitaHttpService.insertCita(id, fechaCita, tipoDonacion).subscribe(resp => {
      console.log(resp);
      if (resp.success) {

        setTimeout(() => {  
          this.sharedService.citaPedida.next(0);
        }, 1500);
      }
      else {

        setTimeout(() => {
          this.sharedService.citaPedida.next(1);
        }, 1500);
      }

      this.router.navigate(['']);
    });
  }
}
