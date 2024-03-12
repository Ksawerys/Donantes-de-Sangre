import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Md5 } from 'ts-md5';
import { NombreCompleto, UserRegsitro } from '../interfaces/auth.interface';
import { AuthService } from '../services/auth.service';
import { FormControl, FormGroup, Validators, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent {

    contraErronea: boolean = false;
    registradoExito: number = -1;  // 0 => regsitro correcto | 1 => registro fallido

  @Output() onFormValido: EventEmitter<number> = new EventEmitter();

  registroForm: FormGroup = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    ap1: new FormControl('', [Validators.required]),
    ap2: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
    passwd: new FormControl('', [Validators.required]),
    passwdRep: new FormControl('', [Validators.required])
  });
   

  constructor(
    private authHttsService: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {

    this.contraErronea = false;
    this.registradoExito = -1;
  }

  registro() {


    const nombre = this.registroForm.get('nombre')?.value + ' '
      + this.registroForm.get('ap1')?.value + ' '
      + this.registroForm.get('ap2')?.value;

    this.contraErronea = false;

    if (this.registroForm.get('passwd')?.value == this.registroForm.get('passwdRep')?.value) {

      const passwdHash = Md5.hashStr(this.registroForm.get('passwd')?.value);

      this.authHttsService.registro({
        email: this.registroForm.get('email')?.value,
        nombre: nombre,
        passwd: passwdHash
      }).subscribe(resp => {

        if (resp.success) {
          this.onFormValido.emit(0);
        }
        else {

          this.onFormValido.emit(1);
        }
      });
    }
    else {
      this.contraErronea = true;
    }
  }

  irAlLogin() {
    this.router.navigate(['auth/login']);
  }
}
