import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs';


@Component({
  selector: 'app-filtro-user',
  templateUrl: './filtro-user.component.html',
  styleUrls: ['./filtro-user.component.scss']
})
export class FiltroUserComponent implements OnInit {
  search = new FormControl('');
  @Output('search') searchEmitter = new EventEmitter<any>();
  ngOnInit(): void {
    this.search.valueChanges.pipe(debounceTime(500)).subscribe((value) => {
      this.searchEmitter.emit(value)
    });
  }
}
