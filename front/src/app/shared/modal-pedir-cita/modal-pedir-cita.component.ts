import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CitasService } from 'src/app/citas/services/citas.service';
import { RegistroComponent } from 'src/app/auth/registro/registro.component';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-modal-pedir-cita',
  standalone: true,
	imports: [NgbDatepickerModule, CommonModule],
  templateUrl: './modal-pedir-cita.component.html',
  styleUrls: ['./modal-pedir-cita.component.scss']
})
export class ModalPedirCitaComponent {
  closeResult = '';
  registrado = false;
  puedePedirCita = false;

  @ViewChild('content') content!: ElementRef;

  constructor(
    private modalService: NgbModal,
    private citasService: CitasService,
  
    private router: Router) {}


  ngAfterViewInit() {
    this.openModal();
  }

  async openModal(){

    this.modalService.dismissAll();
    const user = localStorage.getItem('user');


    let id: string;
    if (user) {
      this.registrado = true;
      id = JSON.parse(user).id;

      const resp = await firstValueFrom(this.citasService.compHaPedidoCita(id));

      this.puedePedirCita = resp.success;
    }
    else {
      this.registrado = false;
    }


    if (!this.registrado || !this.puedePedirCita) {
      this.modalService.open(this.content, { centered: true });
    }
    else {

      this.router.navigate(['/citas/pedircita']);
    }
  }

	open(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      }
    );
	}


  irAlLogin() {
    this.router.navigate(['/auth/login']);
    this.modalService.dismissAll();
  }

  atras() {
    this.modalService.dismissAll();
  }

}
