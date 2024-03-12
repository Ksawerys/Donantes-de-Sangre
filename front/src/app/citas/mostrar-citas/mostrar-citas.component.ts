import { Component } from '@angular/core';
import { concatMapTo, zip } from 'rxjs';
import { Cita, CitaMostrar } from '../interfaces/citas.interface';
import { CitasService } from '../services/citas.service';
import * as moment from 'moment';

@Component({
  selector: 'app-mostrar-citas',
  templateUrl: './mostrar-citas.component.html',
  styleUrls: ['./mostrar-citas.component.scss']
})
export class MostrarCitasComponent {
  
  citasPendientes: CitaMostrar[] = [];
  citasPasadas: CitaMostrar[] = [];
  errorTraerCitas: boolean = false;
  noHayCitasPendientes: boolean = false;
  noHayCitasPasadas: boolean = false;

  constructor(
    private citasService: CitasService
  ) {}

  ngOnInit() {

    this.traerCitas();
  }

  traerCitas() {

    const id = JSON.parse(localStorage.getItem('user')!).id;

    zip([this.citasService.fetchCitaPendienteUser(id), this.citasService.fetchCitasPasadasUser(id)])
      .subscribe(([citasPendientesResp, citasPasadasResp]) => {
        console.log(citasPendientesResp);
        console.log(citasPasadasResp);

        if (citasPendientesResp.success && citasPasadasResp.success) {

          console.log(this.citasPendientes);

          this.colocarCitas(citasPendientesResp.citas, this.citasPendientes);
          this.colocarCitas(citasPasadasResp.citas, this.citasPasadas);


          if (this.citasPendientes.length == 0) this.noHayCitasPendientes = true;
          if (this.citasPasadas.length == 0) this.noHayCitasPasadas = true;
        }
        else {

          this.errorTraerCitas = true;
        }
      });
  }

  colocarCitas(citas: Cita[], array: CitaMostrar[]) {
    citas.forEach(cita => {
      const fechaCompletaPas = moment(cita.fecha, 'YYYY-MM-DD HH:mm:ss');
      array.push({
        id: cita.id,
        dia: fechaCompletaPas.format('DD/MM/YYYY'),
        hora: fechaCompletaPas.format('HH:mm'),
        donacion: cita.donacion,
        cancelada: cita.cancelada
      });
    });
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
      }
      else {

        // TODO: cartelito de fallo
      }
    });
  }
}