import { DomSanitizer } from '@angular/platform-browser';
import { CustomValidators } from '../helpers/validators';
import { environment } from 'src/environment/environment';
import { Direccion } from '../interfaces/direcciones.interfaces';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DireccionesService } from '../services/direcciones.service';
import { entradaSalidaVentana } from 'src/app/shared/animaciones/animaciones';
import { Component, ElementRef, SecurityContext, ViewChild } from '@angular/core';


@Component({
  selector: 'app-config-direcciones',
  templateUrl: './config-direcciones.component.html',
  styleUrls: ['./config-direcciones.component.scss'],
  animations: [entradaSalidaVentana]
})
export class DireccionesConfigComponent {

  @ViewChild('closeModal') closeModal!: ElementRef;

  imgBaseUrl = `${environment.baseUrl}/api/tutorial`;
  timer: NodeJS.Timeout | undefined;
  dirsData: Direccion[] = [];
  dir!: Direccion;
  modalForm: FormGroup;
  exito: boolean = false;
  mensaje: string = '';
  accion: string = '';
  acciones = ['añadir', 'editar'];
  patternNroFormCtrl: RegExp = /^[0-9]{0,3}$/;
  patternUrlFormCtrl: RegExp = /^https:\/\/www\.google\.com\/maps\/embed\?[^&]+!1d([-+]?[0-9]*\.?[0-9]+)!2d([-+]?[0-9]*\.?[0-9]+)/;

  constructor(
    private fb: FormBuilder,
    private domSanitizer: DomSanitizer,
    private dirsService: DireccionesService,
    private customValidators: CustomValidators,
  ) {
    this.modalForm = this.crearFormulario();
  }


  get formCtrls() {
    return this.modalForm.controls;
  }


  ngOnInit() {
    this.dirsService.getDirecciones().subscribe(resp => {
      if (resp.success) this.dirsData = resp.data;
    });
  }


  insertOrUpdateDir() {
    this.resetValidatorsLugar();  // Aunque no tienen Validator.required,
    this.resetValidatorsNumero(); // sigue saltando el error, así que les quito los Validators.
    this.resetValidatorsUrl();

    if (this.modalForm.valid) {
      this.limpiarValoresForm();

      this.dirsService.insertOrUpdateDir(this.modalForm.value)
        .subscribe(resp => {

          if (resp.success) {
            this.dir = resp.data;
            const indexDir = this.dirsData.findIndex(i => i.id == this.dir.id);

            if (indexDir == -1) this.dirsData.push(this.dir);
            else this.dirsData[indexDir] = this.dir;

            this.setMensajeExito();

          } else this.setMensajeError();

          this.setTimer(4000);
          this.closeModal.nativeElement.click();
          this.limpiarFormulario();
        });

    } else this.modalForm.markAllAsTouched();
  }


  setInfoDir(index: number) {
    const dir = this.dirsData[index];

    this.modalForm.patchValue({
      id: dir.id,
      lugar: dir.lugar,
      calle: dir.calle,
      numero: dir.numero,
      ciudad: dir.ciudad,
      provincia: dir.provincia,
      urlMapa: dir.urlMapa,
      cp: dir.cp
    });
  }


  crearFormulario() {
    return this.fb.group({
      id: [null],
      lugar: [null, Validators.maxLength(255)],
      calle: ['', Validators.compose([
        this.customValidators.trimFormControl,
        Validators.required,
        Validators.maxLength(255)
      ])],
      numero: [null, Validators.pattern(this.patternNroFormCtrl)],
      ciudad: ['', Validators.compose([
        this.customValidators.trimFormControl,
        Validators.required,
        Validators.maxLength(255)
      ])],
      provincia: ['', Validators.compose([
        this.customValidators.trimFormControl,
        Validators.required,
        Validators.maxLength(255)
      ])],
      urlMapa: ['', Validators.compose([
        this.customValidators.safeUrl,
        Validators.maxLength(65535),
        Validators.pattern(this.patternUrlFormCtrl),
      ])],
      cp: ['', Validators.compose([
        Validators.required,
        Validators.pattern(/^[0-9]{5}$/),
      ])]
    });
  }


  limpiarFormulario() {
    this.modalForm.reset();
  }


  limpiarValoresForm() {
    Object.keys(this.modalForm.controls).forEach(key => {
      const valor = this.modalForm.value[key];
      if (typeof valor == 'string') this.modalForm.value[key] = valor.trim();
    });

    // Si escribimos y borramos en el input, envía una cadena vacía
    // Lo pongo a null para evitar que envíe la cadena vacía.
    if (this.modalForm.value.numero == '') this.modalForm.value.numero = null;
    if (this.modalForm.value.lugar == '') this.modalForm.value.lugar = null;

    const urlMapa = this.modalForm.value.urlMapa;
    if (urlMapa) this.modalForm.value.urlMapa = this.domSanitizer.sanitize(SecurityContext.URL, urlMapa);
  }


  resetValidatorsNumero() {
    const ctrl = this.formCtrls['numero'];
    if (ctrl.errors && ctrl.errors['required']) {
      ctrl.clearValidators();
      ctrl.setValidators([Validators.pattern(this.patternNroFormCtrl)]);
      ctrl.updateValueAndValidity();
    }
  }


  resetValidatorsLugar() {
    const ctrl = this.formCtrls['lugar'];
    if (ctrl.errors && ctrl.errors['required']) {
      ctrl.clearValidators();
      ctrl.setValidators([Validators.maxLength(255)]);
      ctrl.updateValueAndValidity();
    }
  }


  resetValidatorsUrl() {
    const ctrl = this.formCtrls['urlMapa'];
    if (ctrl.errors && ctrl.errors['required']) {
      ctrl.clearValidators();
      ctrl.setValidators([
        this.customValidators.safeUrl,
        Validators.maxLength(65535),
        Validators.pattern(this.patternUrlFormCtrl)
      ]);
      ctrl.updateValueAndValidity();
    }
  }


  setTimer(tiempo: number) {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.limpiarMensaje(), tiempo);
  }


  limpiarMensaje() {
    this.exito = false;
    this.mensaje = '';
  }


  setMensajeExito() {
    this.exito = true;
    this.mensaje = `Éxito al ${this.accion} la dirección`;
  }


  setMensajeError() {
    this.exito = false;
    this.mensaje = `Error al ${this.accion} la dirección`;
  }
}
