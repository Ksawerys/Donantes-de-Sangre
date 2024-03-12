import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../services/usuarios.service';
import { UserInfo } from '../interfaces/usuarios.interface';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent {

  users: UserInfo[];
  noHayUsuarios: boolean = false;
  codAccion = -1;
  mensaje = '';
  gruposSanguineos = ['A+', 'O+', 'B+', 'AB+', 'A-', 'O-', 'B-', 'AB-'];

  constructor(
    private usuariosService: UsuariosService,
    private formBuilder: FormBuilder
    ) {}


  ngOnInit() {

    this.traerUsuarios();
  }

  infoFormArray: FormGroup[] = [];

  traerUsuarios() {

    this.usuariosService.fetchUsers().subscribe(resp => {

      if (resp.success) {

        this.users = resp.data;
        this.noHayUsuarios = (this.users.length == 0);

        if (!this.noHayUsuarios) {

          this.users.forEach(user => {
            this.infoFormArray.push(new FormGroup({
              gSanguineo: new FormControl(user.gSanguineo),
              nDonante: new FormControl(user.nDonante)
            }))
          });
        }
      }
      else {

        this.noHayUsuarios = true;
        // TODO: catelito de fallo
      }
    });
  }

  modificarUser(infoForm: FormGroup) {

    const userInfo = {
      nDonante: infoForm.get('nDonante')?.value,
      gSanguineo: infoForm.get('gSanguineo')?.value
    }

    this.usuariosService.updateUserAdmin(userInfo).subscribe(resp => {

      if (resp.success) {

        this.traerUsuarios();
      }
      else {

        // TODO: cartelito de fallo
      }
    });
  }
}
