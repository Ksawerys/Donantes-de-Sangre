import { Component, EventEmitter, Output } from '@angular/core';
import { NgbDateStruct, NgbCalendar, NgbDatepickerModule, NgbDatepickerConfig, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
// import '@angular/localize/init';
import { JsonPipe } from '@angular/common';


@Component({
	selector: 'app-calendario',
	standalone: true,
	imports: [NgbDatepickerModule, FormsModule, JsonPipe],
	templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.scss']
})
export class CalendarioComponent {

  @Output() onNuevaFecha: EventEmitter<NgbDateStruct> = new EventEmitter();

	today: NgbDateStruct;
  model: NgbDateStruct | undefined;
  displayMonths = 1;
  navigation = 'select';


	constructor(private calendar: NgbCalendar, private ngbDatepickerConfig: NgbDatepickerConfig) {
    this.today = this.calendar.getToday();
  }


  mandarFecha() {
    this.onNuevaFecha.emit(this.model);
  }


  reiniciarFecha() {
    if (this.model) this.model = undefined;
  }
}
