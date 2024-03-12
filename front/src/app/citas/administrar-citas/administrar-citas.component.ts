import { CitaAdmin, CitaAdminMostrar, CitaAdminPendienteMostrar } from '../interfaces/citas.interface';
import { zip } from 'rxjs';
import { CitasService } from '../services/citas.service';
import { Component } from '@angular/core';
import * as moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalAplazarCitaComponent } from '../modal-aplazar-cita/modal-aplazar-cita.component';
import { entradaSalidaVentana } from 'src/app/shared/animaciones/animaciones';


@Component({
  selector: 'app-administrar-citas',
  templateUrl: './administrar-citas.component.html',
  styleUrls: ['./administrar-citas.component.scss'],
  animations: [entradaSalidaVentana]
})
export class AdministrarCitasComponent {

  citasPendientes: CitaAdminMostrar[] = [];
  citasPasadas: CitaAdminMostrar[] = [];
  mostrarBotonHaDonado: boolean[]  = [];
  errorTraerCitas: boolean = false;
  noHayCitasPendientes: boolean = false;
  noHayCitasPasadas: boolean = false;
  codAccion: number = -1;
  mensaje: string;
  timer: NodeJS.Timeout | undefined;

  constructor(
    private modal: NgbModal,
    private citasService: CitasService
  ) {}

  ngOnInit() {

    this.traerCitasAdmin();

    // this.citasService.codAccion.subscribe(ca => {

    //   this.codAccion = ca;
    // });
  }


  traerCitasAdmin() {
    zip([this.citasService.fetchCitasPendientes(), this.citasService.fetchCitasPasadas()])
      .subscribe(([citasPendientesResp, citasPasadasResp]) => {
        if (citasPendientesResp.success && citasPasadasResp.success) {
          citasPasadasResp.citas.forEach(cita => {
            this.mostrarBotonHaDonado.push(cita.haDonado == 0);
          });
          
          this.colocarCitas(citasPendientesResp.citas, this.citasPendientes);
          this.colocarCitas(citasPasadasResp.citas, this.citasPasadas);

          if (this.citasPendientes.length == 0) this.noHayCitasPendientes = true;
          if (this.citasPasadas.length == 0) this.noHayCitasPasadas = true;
        }
        else {

          this.errorTraerCitas = true;

          this.codAccion = 1;
          this.mensaje = "Se ha producido un error. Inténtalo más tarde."
          this.setTimer(4000);
        }
      });
  }


  colocarCitas(citas: CitaAdmin[], array: CitaAdminMostrar[]) {
    let citaHaDonado = '';

    array.length = 0;
    citas.forEach(cita => {
      const fechaCompletaPas = moment(cita.fecha, 'YYYY-MM-DD HH:mm:ss');
      array.push({
        id: cita.id,
        dia: fechaCompletaPas.format('DD/MM/YYYY'),
        hora: fechaCompletaPas.format('HH:mm'),
        donacion: cita.donacion,
        cancelada: cita.cancelada,
        haDonado: cita.haDonado,
        user: {
          id: cita.user.id,
          nombre: cita.user.nombre
        }
      });
    });
  }


  abrirModal(event: any) {

    const liElement = event.target.closest('li');
    const listItems = Array.from(liElement.parentElement.children);
    const index = listItems.indexOf(liElement);
    
    setTimeout(() => {  
      this.citasService.idCita.next(this.citasPendientes[index].id);
      this.citasService.diaCita.next(this.citasPendientes[index].dia);
      this.citasService.horaCita.next(this.citasPendientes[index].hora);
    }, 1500);
    
    
    this.modal.open(ModalAplazarCitaComponent).result.then(resultado => {
      
    }, reason => {

      this.traerCitasAdmin();
      this.citasService.codAccion.subscribe(ca => {

        this.mensaje = ca == 0 ? 'Cita aplazada con éxito.' 
          : 'Error al aplazar la cita.';
        this.codAccion = ca;
        this.setTimer(4000);
      });
    });
  }


  setTimer(tiempo: number) {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.codAccion = -1, tiempo);
  }


  cancelarCita(event: any) {
    const liElement = event.target.closest('li');
    const listItems = Array.from(liElement.parentElement.children);
    const index = listItems.indexOf(liElement);

    const id = this.citasPendientes[index].id;

    // const confirm = await getConfirmacion();

    this.citasService.cancelarCita(id).subscribe(resp => {
      if (resp.success) {
        
        this.citasPendientes[index].cancelada = true;
        this.mensaje = 'Cita cancelada con éxito.';
        this.codAccion = 0;
        this.setTimer(4000);
      }
      else {

        this.mensaje = 'Error al cancelar la cita.';
        this.codAccion = 1;
        this.setTimer(4000);
      }
    });
  }


  onHaDonadoChange(value: number, index: number): void {
    
    this.citasPasadas[index].haDonado = value;
    this.citasService.confirmarHaDonado(this.citasPasadas[index].id, value).subscribe(resp => {});
  }
}
