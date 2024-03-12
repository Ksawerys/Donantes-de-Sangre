import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbDatepickerModule, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, zip } from 'rxjs';
import { CitasService } from 'src/app/citas/services/citas.service';
import { DatePickerComponent } from '../date-picker/date-picker.component';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
    selector: 'app-modal-aplazar-cita',
    standalone: true,
    templateUrl: './modal-aplazar-cita.component.html',
    styleUrls: ['./modal-aplazar-cita.component.scss'],
    imports: [NgbDatepickerModule, CommonModule, DatePickerComponent, ReactiveFormsModule]
})
export class ModalAplazarCitaComponent {
  closeResult = '';
  citaId: string;
  citaPrevDia: string;
  citaPrevHora: string;
  fecha: NgbDateStruct;
  fechaSeleccionada: string;
  horasDisponibles: string[] = [];
  noHayHoras: boolean = false;
  sinSeleccionar = true;
  codAccion = -1;

  
  aplazarCitaForm: FormGroup = new FormGroup({hora: new FormControl('', [Validators.required])});

  @ViewChild('content') content!: ElementRef;

  constructor(
    private modalService: NgbModal,
    private citasService: CitasService,
    private router: Router) {}


  ngAfterViewInit() {

    
    zip([this.citasService.idCita, this.citasService.diaCita, this.citasService.horaCita])
      .subscribe(([id, dia, hora]) => {

        this.citaId = id;
        this.citaPrevDia = dia;
        this.citaPrevHora = hora;
      });
  }


  async openModal(){
    this.modalService.dismissAll();
    this.modalService.open(this.content, { centered: true });
  }


  open(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      }
    );
	}


  transFecha(fechaCalendar: NgbDateStruct) {
    this.fechaSeleccionada = this.fecha.year + '-' + this.fecha.month + '-' + this.fecha.day;
  }


  traerHorario() {
    this.citasService.fetchHorasDisponibles(this.fechaSeleccionada).subscribe(resp => {
      this.horasDisponibles = resp.horas;
      if (this.horasDisponibles.length == 0) this.noHayHoras = true;
    });
  }


  setDia(event: NgbDateStruct) {
    this.fecha = event;
    this.transFecha(this.fecha);
    this.traerHorario(); 
    this.sinSeleccionar = false;
  }


  aplazarCita() {
    const fechaCita = this.fechaSeleccionada
      + ' ' + this.aplazarCitaForm.get('hora')?.value + ':00';

    const fechaAntigua = (this.citaPrevDia + ' ' + this.citaPrevHora + ':00').replaceAll('/', '-');

    this.citasService.aplazarCita(this.citaId, fechaAntigua, fechaCita).subscribe(resp => {
      if (resp.success) {

        setTimeout(() => {
          this.citasService.codAccion.next(0);
        }, 1500);
        this.modalService.dismissAll();
      }
      else {

        setTimeout(() => {
          this.citasService.codAccion.next(1);
        }, 1500);
        this.modalService.dismissAll();
      }
    });
  }


  cancelar() {

    this.modalService.dismissAll();
  }
}
