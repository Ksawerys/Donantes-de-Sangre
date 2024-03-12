import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/services/auth.service';
import { UserInfo } from '../interfaces/usuarios.interface';
import { UsuariosService } from '../services/usuarios.service';
import { Md5 } from 'ts-md5';
import { entradaSalidaVentana } from 'src/app/shared/animaciones/animaciones';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
  animations: [entradaSalidaVentana]
})
export class PerfilComponent {

  actualizado!: boolean;
  mensaje: String = '';

  contraNoCoincide = false;
  errorAutenticacion = false;

  dniModificado = false;
  nombreModificado = false;

  codAccion = -1;

  timer: NodeJS.Timeout | undefined;

  info: UserInfo = {
    id: '',
    nombre: '',
    dni: '',
    nDonante: 0,
    gSanguineo: '',
    codSeguridad: ''
  }

  passwdForm: FormGroup = new FormGroup({
    passwd: new FormControl('', [Validators.required]),
    passwdRep: new FormControl('', [Validators.required]),
    passwdNueva: new FormControl('', [Validators.required])
  });

  infoForm: FormGroup = new FormGroup({
    nombre: new FormControl(this.info.nombre),
    dni: new FormControl(this.info.dni, Validators.pattern("^([0-9]{8})([A-Z])$")),
    gSanguineo: new FormControl(this.info.gSanguineo),
    nDonante: new FormControl(this.info.nDonante)

  });

  gSanguineoInput: FormControl = new FormControl({ value: this.info.gSanguineo, disabled: true });
  nDonanteInput: FormControl = new FormControl({ value: this.info.nDonante, disabled:true });

  constructor(
    private usuariosService: UsuariosService,
    private authService: AuthService
  ) {}

  ngOnInit() {

    this.traerInfo();
  }


  setTimer(tiempo: number) {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.codAccion = -1, tiempo);
  }


  traerInfo() {
    this.usuariosService.fetchInfoUser().subscribe(resp => {
      if (resp.success) {

        this.infoForm.patchValue({
          nombre: resp.data.nombre,
          dni: resp.data.dni,
          nDonante: resp.data.nDonante,
          gSanguineo: resp.data.gSanguineo
        });

        this.info = resp.data;

      }
      else {

        this.codAccion = 1;
        this.mensaje = "Se ha producido un error. Inténtalo más tarde."
        this.setTimer(4000);
      }
    });
  }


  cambiarPasswd() {

    if (this.passwdForm.get('passwdNueva')?.value == this.passwdForm.get('passwdRep')?.value) {

      this.contraNoCoincide = false;


      const passwdHash = Md5.hashStr(this.passwdForm.get('passwd')?.value);
      const nuevaPasswdHash = Md5.hashStr(this.passwdForm.get('passwdNueva')?.value);

      this.authService.cambiarPasswd(passwdHash, nuevaPasswdHash).subscribe(resp => {

        if (resp.success) {

          this.codAccion = 0;
          this.mensaje = 'Contraseña cambiada con éxito.'
          this.setTimer(4000);
        }
        else {

          this.codAccion = 1;
          this.mensaje = 'Error de autenticación.'
          this.setTimer(4000);
        }
      });
    }
    else {

      this.contraNoCoincide = true;
    }
  }

  updateUser() {

    const valoresCambiados: UserInfo = this.infoForm.value;

    valoresCambiados.id = this.info.id;

    this.usuariosService.updateUserPerfil(valoresCambiados).subscribe(resp => {
      if (resp.success) {

        this.traerInfo();

        this.codAccion = 0;
        this.mensaje = 'Información actualizada con éxito.'
        this.setTimer(4000);
      }
      else {

        this.codAccion = 1;
        this.mensaje = 'Error al actualizar la información.'
        this.setTimer(4000);
      }
    });
  }


  onDniValueChange() {
    this.dniModificado = !(this.infoForm.get('dni')?.value == this.info.dni);
  }

  onNombreValueChange() {
    this.nombreModificado = !(this.infoForm.get('nombre')?.value == this.info.nombre);
  }
}
