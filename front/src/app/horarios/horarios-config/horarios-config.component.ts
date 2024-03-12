import { tap, zip } from 'rxjs';
import { Time } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { CitasService } from '../../citas/services/citas.service';
import * as interfaces from '../../citas/interfaces/citas.interface';
import { entradaSalidaVentana } from 'src/app/shared/animaciones/animaciones';
import { Dia, Horario, HorarioMostrar, Hora } from '../interfaces/horario.interfaces';
import { diaSeleccionado } from '../validators/valores-horas.validator';
import { FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { HorariosService } from '../services/horarios.service';

@Component({
  selector: 'app-horarios-config',
  templateUrl: './horarios-config.component.html',
  styleUrls: ['./horarios-config.component.scss'],
  animations: [entradaSalidaVentana]
})
export class HorariosConfigComponent {

  @ViewChild('closeModalHorario') closeModalHorario!: ElementRef;

  // Alicia
  horarioForm: FormGroup;
  infoHorario!: HorarioMostrar;
  horariosData: Horario[] = [];
  horariosMostrar!: HorarioMostrar[];
  exito: boolean = false;
  timer: NodeJS.Timeout | undefined;
  semanaSinSabado = [{ nombre: "lunes", letra: "l" }, { nombre: "martes", letra: "m" }, { nombre: "miércoles", letra: "x" },
  { nombre: "jueves", letra: "j" }, { nombre: "viernes", letra: "v" }];
  accion: string = '';
  acciones = ['añadir', 'editar', 'eliminar'];
  mensaje: string = '';
  indexHorario: number = -1;

  //Mario
  divCount = 0;
  horas:interfaces.Horario = {}; //: interfaces.Horario = {l: [], m: [], x: [], j: [], v: [], s: []};
  horariosDias: interfaces.HorarioDia[] = [];
  horarioMostrar: interfaces.HorarioDia[] = [];
  horasMostrar: string[] = [];
  isHoraEntradaSalida: boolean[] = [];
  numCitasALaVez: string;
  horaValida: boolean;
  intervalId: any;
  aLaVezValido: boolean;
  diaSeleccionado = 'l';

  currentHour = new Date();
  time = { hour: this.currentHour.getHours(), minute: this.currentHour.getMinutes() };

  aLaVezForm: FormGroup = new FormGroup({
    nALaVez: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
  });

  diasSemana = [
    { dia: 'lunes', cod : 'l' },
    { dia: 'martes', cod : 'm' },
    { dia: 'miércoles', cod : 'x' },
    { dia: 'jueves', cod : 'j '},
    { dia: 'viernes', cod : 'v' },
    { dia: 'sábado', cod : 's' },
  ];


  constructor(
    private fb: FormBuilder,
    private citasService: CitasService,
    private horariosService: HorariosService
  ) {
    this.limpiarHorario();
    this.horarioForm = this.crearFormularioHorario();
  }


  set index(index: number) {
    this.indexHorario = index;
  }


  get horarioFormCtrls() {
    return this.horarioForm.controls;
  }


  get diasHorarioCtrls() {
    return (this.horarioForm.get("dias") as FormArray).controls;
  }


  ngOnInit() {
    this.horariosService.getHorarios().subscribe(resp => {
      if (resp.success) this.iniciarHorariosMostrar(resp.data);
    });

    // Mario
    this.traerHoras().subscribe(() => {
      this.cargarDia(this.diaSeleccionado);

      this.citasService.getCitasALaVez().subscribe(resp => {

        if (resp.success) {
          this.numCitasALaVez = resp.num.toString();
        }
      });
      this.intervalId = setInterval(() => {
        this.checkTime();
      }, 250);
    });
  }

  // Alicia
  crearFormularioHorario() {
    const dias = this.crearSemana();

    return this.fb.group({
      id: [null],
      dias: dias,
      hEntrada: [null, Validators.required],
      hSalida: [null, Validators.required],
    });
  }


  iniciarHorariosMostrar(datos: Horario[]) {
    let horas: Hora[] = []; // Horas de entrada y de salida de cada horario.
    let diasHora: Horario[] = [];

    this.horariosMostrar = [];
    datos.forEach(horario => { // Recojo los distintos grupos de horas
      if (!horas.find(h => h.entrada == horario.hEntrada && h.salida == horario.hSalida))
        horas.push({ "entrada": horario.hEntrada, "salida": horario.hSalida });
    });

    for (let i = 0; i < horas.length; i++) {// Recojo los días que tienen ese grupo de horas
      diasHora = datos.filter(h => h.hEntrada == horas[i].entrada && h.hSalida == horas[i].salida);
      const hMostrar: HorarioMostrar = this.crearHorarioMostrar(diasHora, horas[i].entrada, horas[i].salida);
      this.horariosMostrar.push(hMostrar);
    }
  }


  crearHorarioMostrar(diasHora: Horario[], hEntrada: Time, hSalida: Time) {
    let listaDias: Dia[] = []; //Días de un horario concreto.
    let idDia: number | undefined;
    let selecc: boolean;

    this.semanaSinSabado.forEach(dia => {
      idDia = diasHora.find(d => d.dia == dia.nombre)?.id;
      selecc = (diasHora.find(d => d.dia == dia.nombre)) ? true : false;
      listaDias.push(this.crearDiaMostrar(dia.nombre, dia.letra, selecc, idDia));
    });

    return {
      dias: listaDias,
      hEntrada: hEntrada,
      hSalida: hSalida
    };
  }


  crearSemana() {
    let listaDias: FormArray = this.fb.array([], diaSeleccionado());

    this.semanaSinSabado.forEach(dia => {
      listaDias.push(this.crearDia(dia.nombre, dia.letra, false));
    });

    return listaDias;
  }


  crearDia(nombre: String, letra: String, selecc: boolean) {
    return this.fb.group({
      id: [null],
      nombre: [nombre],
      letra: [letra],
      seleccionado: [selecc]
    });
  }


  crearDiaMostrar(nombre: string, letra: string, selecc: boolean, id: number = -1) {
    return {
      id: id,
      nombre: nombre,
      letra: letra,
      seleccionado: selecc
    }
  }


  crearHorario(dia: Dia, hEntrada: Time, hSalida: Time) {
    return {
      id: dia.id,
      codDia: dia.letra,
      dia: dia.nombre,
      hEntrada: hEntrada,
      hSalida: hSalida
    };
  }


  deleteHorarios(index: number) {
    const horarios = this.horariosMostrar[index];
    const horariosBorrar: Horario[] = [];

    horarios.dias.forEach(dia => {
      if (dia.id != -1) horariosBorrar.push(this.crearHorario(dia, horarios.hEntrada, horarios.hSalida));
    });

    this.horariosService.deleteHorarios(horariosBorrar)
      .subscribe(resp => {

        if (resp.success) {
          this.horariosMostrar.splice(index, 1);
          this.setMensajeExito(`Exito al ${this.accion} el horario`);

        } else this.setMensajeError(`Error al ${this.accion} el horario`);

        this.setTimer(4000);
      });
  }


  insertHorarios(horarios: Horario[]) {
    this.horariosService.insertHorarios(horarios)
      .subscribe(resp => {

        if (resp.success) {

          const datos: Horario[] = resp.data;
          const hMostrar = this.crearHorarioMostrar(datos, datos[0].hEntrada, datos[0].hSalida);
          this.horariosMostrar.push(hMostrar);

          this.setMensajeExito(`Exito al ${this.accion} el horario`);

        } else this.setMensajeError(`Error al ${this.accion} el horario`);

        this.setTimer(4000);
        this.closeModalHorario.nativeElement.click();
        this.limpiarFormulario();
      });
  }


  updateHorarios(hGuardar: Horario[], hBorrar: number[]) {
    this.horariosService.updateHorarios(hGuardar, hBorrar)
      .subscribe(resp => {

        if (resp.success) {

          const datos: Horario[] = resp.data;
          const horariosNuevos = this.crearHorarioMostrar(datos, datos[0].hEntrada, datos[0].hSalida);
          this.horariosMostrar[this.indexHorario] = horariosNuevos;

          this.setMensajeExito(`Exito al ${this.accion} el horario`);

        } else this.setMensajeError(`Error al ${this.accion} el horario`);

        this.setTimer(4000);
        this.closeModalHorario.nativeElement.click();
        this.limpiarFormulario();
      });
  }


  insertOrUpdateHorario() {
    if (this.horarioForm.valid) {
      const horariosGuardar: Horario[] = [];
      const horariosBorrar: number[] = [];
      const datos = this.horarioForm.value;

      this.horarioForm.value.dias.forEach((dia: Dia) => {
        if (dia.seleccionado) horariosGuardar.push(this.crearHorario(dia, datos.hEntrada, datos.hSalida));
        else horariosBorrar.push(dia.id);
      });

      if (this.accion == this.acciones[0]) this.insertHorarios(horariosGuardar);
      else if (this.accion == this.acciones[1]) this.updateHorarios(horariosGuardar, horariosBorrar);

    } else this.horarioForm.markAllAsTouched();
  }


  limpiarFormulario() {
    //this.horarioForm.reset();
    this.horarioForm = this.crearFormularioHorario();
  }


  setInfoHorario(index: number) {
    this.infoHorario = this.horariosMostrar[index];

    this.horarioForm.patchValue({
      index: index,
      dias: this.infoHorario.dias,
      hEntrada: this.infoHorario.hEntrada,
      hSalida: this.infoHorario.hSalida
    });
  }


  limpiarHorario() {
    this.infoHorario = { dias: [], hEntrada: { hours: 0, minutes: 0 }, hSalida: { hours: 0, minutes: 0 } };
  }


  setTimer(tiempo: number) {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.limpiarMensaje(), tiempo);
  }


  limpiarMensaje() {
    this.exito = false;
    this.mensaje = '';
  }


  setMensajeExito(mensaje: string) {
    this.exito = true;
    this.mensaje = mensaje;
  }


  setMensajeError(mensaje: string) {
    this.exito = false;
    this.mensaje = mensaje;
  }


  // Mario
  formatHora(time: any) {
    let t = {
      hour: '',
      minute: ''
    };

    t.hour = time.hour < 10 ? '0' + time.hour : time.hour;
    t.minute = time.minute < 10 ? '0' + time.minute : time.minute;

    return t;
  }


  checkTime() {
    const formatedTime = this.formatHora(this.time);
    const cTime = formatedTime.hour + ':' + formatedTime.minute + ':00';
    this.horaValida = false;

    this.horarioMostrar.forEach(h => {
      if (h.hEntrada <= cTime && h.hSalida > cTime) {
        this.horaValida = true;
        return;
      }
    });
  }


  traerHoras() {

    return zip([this.citasService.fetchHorasCitas(), this.citasService.fetchHorarios()])
      .pipe(tap(([horasCitasResp, horariosResp]) => {

        if (horasCitasResp.success && horariosResp.success) {
          this.horas = horasCitasResp.horas;
          this.horariosDias = horariosResp.data;
        }
        else {

          this.setMensajeError("Se ha producido un error. Inténtalo más tarde.");
          this.setTimer(4000);
        }

      }));
  }


  quitar(index: number) {

    this.citasService.deleteHoraCita(this.horasMostrar[index] + ':00').subscribe(resp => {
      if (resp.success) {

        this.traerHoras().subscribe();
      }
      else {

        this.setMensajeError("Se ha producido un error. Inténtalo más tarde.");
        this.setTimer(4000);

      }
    });
    this.horasMostrar.splice(index, 1);
    this.isHoraEntradaSalida.splice(index, 1);
  }


  anadirHora(dia: string) {
    const formatedTime = this.formatHora(this.time);
    // const cTime = formatedTime.hour + ':' + formatedTime.minute + ':00';
    const horaAnadir = formatedTime.hour + ':' + formatedTime.minute;
    // let anadir = true;

    // this.horasMostrar.map(hora => {if (hora == horaAnadir) {anadir = false; return;}});

    this.citasService.insertHoraCita(this.diaSeleccionado, horaAnadir + ':00').subscribe(resp => {

      if (resp.success) {
        // this.horas.push(this.time.hour + ':' + this.time.minute);
        // this.horas.sort((a, b) => {
        //   const time1 = new Date("1970-01-01T" + a + ":00Z");
        //   const time2 = new Date("1970-01-01T" + b + ":00Z");

        //   return time1.getTime() - time2.getTime();
        // });

        this.traerHoras().subscribe(() => {

          this.cargarDia(this.diaSeleccionado);
        });
      }
      else {

        this.setMensajeError("Se ha producido un error. Inténtalo más tarde.");
        this.setTimer(4000);
      }
    });
  }


  onDiaChange(dia: string) {
    this.diaSeleccionado = dia;
    this.cargarDia(dia);
  }


  cargarDia(dia: string) {
    let horas: string[] = [];
    this.horasMostrar.length = 0;
    this.isHoraEntradaSalida.length = 0;

    for (const key in this.horas) {
      if (dia == key) {
        horas = this.horas[key];
        this.horarioMostrar = this.horariosDias.filter(dia => {return dia.codDia == key});
      }
    }

    this.horarioMostrar.forEach(hEntradaSalida => {
      this.horasMostrar.push(hEntradaSalida.hEntrada.slice(0, -3));
      this.isHoraEntradaSalida.push(true);

      horas.forEach(hora => {
        if (hEntradaSalida.hEntrada <= hora && hEntradaSalida.hSalida > hora) {
          this.horasMostrar.push(hora.slice(0, -3));
          this.isHoraEntradaSalida.push(false);
        }
      });

      this.horasMostrar.push(hEntradaSalida.hSalida.slice(0, -3));
      this.isHoraEntradaSalida.push(true);
    });
  }


  updateCitasALavez() {
    this.citasService.updateCitasALaVez(this.aLaVezForm.get('nALaVez')?.value).subscribe(resp => {
      if (resp.success) {

        this.setMensajeExito("Cita actualizada con éxito.");
        this.setTimer(4000);
      }
      else {

        this.setMensajeError("Se ha producido un error. Inténtalo más tarde.");
        this.setTimer(4000);
      }
    });
  }
}
