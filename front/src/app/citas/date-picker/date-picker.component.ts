import { Component, EventEmitter, Output } from '@angular/core';
import { NgbDateStruct, NgbCalendar, NgbDatepickerModule, NgbDatepickerConfig, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
// import '@angular/localize/init';
import { JsonPipe } from '@angular/common';


@Component({
	selector: 'app-date-picker',
	standalone: true,
	imports: [NgbDatepickerModule, FormsModule, JsonPipe],
	templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss']
})
export class DatePickerComponent {

	today: NgbDateStruct;
  displayMonths = 1;
  navigation = 'select';
  model: NgbDateStruct;
	date: { year: number; month: number; }; 

  @Output() onNuevaFecha: EventEmitter<NgbDateStruct> = new EventEmitter();


  jsonDates = {
    disable: [6, 7],
    disabledDates: [ // hacerlo parametrizable;
      { year: 2020, month: 2, day: 23 },
    ]
  };

  isDisabled;
	constructor(
    private calendar: NgbCalendar,
    private ngbDatepickerConfig: NgbDatepickerConfig
    ) {
      this.today = this.calendar.getToday();
      ngbDatepickerConfig.minDate = this.today;
      ngbDatepickerConfig.weekdays = true;

      this.isDisabled = (
        date: NgbDateStruct
      
        ) => {
        return this.jsonDates.disabledDates.find(x =>
          (new NgbDate(x.year, x.month, x.day).equals(date)) 
          || (this.jsonDates.disable.includes(calendar.getWeekday(new NgbDate(date.year,date.month,date.day))))
        )
          ? true
          : false;
      };
    }

  ngOnInit() {
       
  }

	selectToday() {
		this.model = this.today;
	}

  mandarFecha() {
    this.onNuevaFecha.emit(this.model);
  }

} 