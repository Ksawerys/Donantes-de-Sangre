import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CitasService } from 'src/app/citas/services/citas.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { CitaInfo } from 'src/app/citas/interfaces/citas.interface';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.scss']
})
export class PrincipalComponent implements OnInit {
  aviso: number = -1;
  idUser: string = "";
  idCita: string = "";
  citaUser: CitaInfo;
  esAdmin: boolean
  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private citaService: CitasService,
    private authService: AuthService) {
    this.esAdmin = false;
    this.citaUser = {
      nombre: "",
      donacion: "",
      fecha: "",
      hora: "",
      cancelada:false
    }
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params['idU'].length >= 10 && params['idC'].length >= 10) { //En primer lugar limito que no entren con cualquier parametro a la ruta.
        this.idUser = this.desencriptarId(params['idU']);
        this.idCita = this.desencriptarId(params['idC']);

        if (localStorage.getItem('user') != null) {            //Compruebo si el usuario esta registrado para poder ver la cita
          let datos = JSON.parse(localStorage.getItem('user') || "");

          this.authService.puedeModificar().subscribe(resp => {
            this.esAdmin = (resp) ? true : false;
            if (this.idUser == datos.id || this.esAdmin) {   //Compruebo si el usuario que esta registrado es el que pidio la cita o es el administrador
              if (!this.esAdmin) {
                this.citaService.getUltimaCitaUser(this.idCita).subscribe((resp) => {
                  if (resp.success) {
                    this.citaUser = resp.data;
                    this.aviso = 0;
                    if(this.citaUser.cancelada)this.aviso=4;
                  } else {
                    this.aviso = 2;
                  }
                });
              } else {
                this.citaService.confirmarHaDonado(this.idCita, 1).subscribe((resp) => {
                  if (resp.success) {
                    this.aviso = 1;
                  } else {
                    this.aviso = 5;
                  }
                });
              }
            } else {
              this.aviso = 3;
            }
          });
        } else {
          this.aviso = 6;
        }
      } else {
        this.aviso = 2;
      }

    });
  };

  irASoyApto() {
    this.router.navigate(['./aviso']);
  }
  irAInicio() {
    this.router.navigate(['/']);
  }
  desencriptarId(id: string): string {
    return id.slice(9);
  }
}
