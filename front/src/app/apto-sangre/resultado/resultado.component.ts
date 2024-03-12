import { Component, OnInit } from '@angular/core';
import { aptosangreService } from '../servicio/apto-sangre.service';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-resultado',
  templateUrl: './resultado.component.html',
  styleUrls: ['./resultado.component.scss']
})
export class ResultadoComponent implements OnInit{
  constructor(public apto_servicio: aptosangreService, private AuthService: AuthService) { }

  mensaje_respuesta: string[] = [];

  puedeModificar: boolean = false;
  estaRegistrado: boolean = false;

  ngOnInit(): void {
      this.apto_servicio.preguntasEnviadas[1].forEach((respuesta: any) => {
        if(respuesta == 0){
          this.mensaje_respuesta.push("No");
        }
        else{
          this.mensaje_respuesta.push("Si");
        }
      });
  }

  comprobarPuedeModificar() {
    if (this.estaRegistrado) {
      this.AuthService.puedeModificar().subscribe((resp:boolean) => {
        this.puedeModificar = (resp) ? true : false;
      });
    }
  }
}
