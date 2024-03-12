import { Telefono } from '../interfaces/telefonos.interfaces';
import { TelefonosService } from '../services/telefonos.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { entradaSalidaVentana } from 'src/app/shared/animaciones/animaciones';

@Component({
  selector: 'app-config-tfnos',
  templateUrl: './config-tfnos.component.html',
  styleUrls: ['./config-tfnos.component.scss'],
  animations: [entradaSalidaVentana]
})
export class TfnosConfigComponent implements OnInit {

  @ViewChild('closeModal') closeModal!: ElementRef;

  timer: NodeJS.Timeout | undefined;
  tfnosData: Telefono[] = [];
  telefono!: Telefono;
  modalForm: FormGroup;
  exito: boolean = false;
  mensaje: string = '';
  accion: string = '';
  acciones = ['añadir', 'editar', 'eliminar'];


  constructor(private tfnosService: TelefonosService, private fb: FormBuilder) {
    this.modalForm = this.crearFormulario();
  }


  get formCtrls() {
    return this.modalForm.controls;
  }


  ngOnInit() {
    this.tfnosService.getTelefonos().subscribe(resp => {
      if (resp.success) this.tfnosData = resp.data;
    });
  }


  insertOrUpdateTfno() {
    this.resetValidatorsExtension();

    if (this.modalForm.valid) {
      // Al editar un teléfono, si borramos la extensión, envía una cadena vacía.
      //Lo pongo a null para evitar que envíe la cadena vacía.
      if (this.modalForm.value.extension == '') this.modalForm.value.extension = null;

      this.tfnosService.insertOrUpdateTfno(this.modalForm.value)
        .subscribe(resp => {

          if (resp.success) {
            this.telefono = resp.data;
            const indexTfno = this.tfnosData.findIndex(i => i.id == this.telefono.id);

            if (indexTfno == -1) this.tfnosData.push(this.telefono);
            else this.tfnosData[indexTfno] = this.telefono;

            this.setMensajeExito();

          } else this.setMensajeError();

          this.setTimer(4000);
          this.closeModal.nativeElement.click();
          this.limpiarFormulario();
        });

    } else this.modalForm.markAllAsTouched();
  }


  setInfoTfn(index: number) {
    const tfno = this.tfnosData[index];
    this.modalForm.patchValue({ id: tfno.id, numero: tfno.numero, extension: tfno.extension });
  }


  deleteTfno(index: number) {
    const tfno = this.tfnosData[index];

    if (tfno) {
      this.tfnosService.deleteTfno(tfno.id)
        .subscribe(resp => {

          if (resp.success) {

            this.tfnosData.splice(this.tfnosData.findIndex(i => i.id == resp.data), 1);
            this.setMensajeExito();

          } else this.setMensajeError();

          this.setTimer(4000);
        });
    }
  }


  crearFormulario() {
    return this.fb.group({
      id: [null],
      numero: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(20),
        Validators.pattern(/^(\(?(\+34|0034|34)\)?[ -]+)?([0-9][ -]*){9}/)
      ])],
      extension: [null, Validators.compose([
        Validators.maxLength(11),
        Validators.pattern(/^[0-9]*$/)
      ])]
    });
  }


  resetValidatorsExtension() {
    const extControl = this.formCtrls['extension'];

    if (extControl.errors && extControl.errors['required']) { //Aunque no tiene Validator.required,
      extControl.clearValidators();                           //sigue saltando el error, así que le quito los Validators.
      extControl.setValidators([Validators.pattern(/^[0-9]*$/)]);
      extControl.updateValueAndValidity();
    }
  }


  limpiarFormulario() {
    this.modalForm.reset();
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
    this.mensaje = `Éxito al ${this.accion} el teléfono`;
  }


  setMensajeError() {
    this.exito = false;
    this.mensaje = `Error al ${this.accion} el teléfono`;
  }
}
