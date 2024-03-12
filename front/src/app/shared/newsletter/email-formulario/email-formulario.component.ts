import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SharedService } from '../../services/shared.service';
import { Email } from '../../interfaces/shared.interface';

@Component({
  selector: 'app-email-formulario',
  templateUrl: './email-formulario.component.html',
  styleUrls: ['./email-formulario.component.scss']
})
export class EmailFormularioComponent {

  @Output() onSubmit: EventEmitter<boolean> = new EventEmitter();

  emailForm!: FormGroup;
  mensaje: string = '';
  icono: string = '';
  suscrito: boolean | undefined;

  constructor(
    private fb: FormBuilder,
    private sharedService: SharedService
  ) { }

  //Alicia
  ngOnInit(): void {
    this.emailForm = this.fb.group({
      email: ['', Validators.compose([
        Validators.required,
        Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")
      ])]
    });
  }

  //Alicia
  suscribirse() {
    if (this.emailForm.valid) {

      const email: Email = this.emailForm.value;

      this.sharedService.suscripcionNewsletter(email)
        .subscribe(resp => {
          this.mensaje = resp.msg;
          this.suscrito = resp.success;

          if (resp.success) {
            this.onSubmit.emit(true);
            return;
          }
        });

    } else {
      this.suscrito = false;
      this.mensaje = 'Email no válido';
    }
  }
}
