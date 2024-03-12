import { Component, OnInit, NgZone } from '@angular/core';
import { UserLogin } from '../interfaces/auth.interface';
import { AuthService } from '../services/auth.service';
import { Md5 } from 'ts-md5';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/shared/services/shared.service';
import { WebSocketService } from '../../paginas/services/web-socket.service';
import { FormBuilder, FormGroup, Validator } from '@angular/forms';
declare global {
  const google: typeof import('google-one-tap');
}
import { CredentialResponse, PromptMomentNotification } from 'google-one-tap';
import { environment } from 'src/environment/environment';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit{
  erroneo: boolean = false;
  private client_ID = environment.client_ID;
  nuevoUsr: UserLogin = {
    email: '',
    passwd: ''
  };

  constructor(
    private authHttsService: AuthService,
    private SharedService: SharedService,
    private router: Router,
   // private WebSocketService:WebSocketService,
    private _ngZone: NgZone,
    private service: AuthService,
    private fb: FormBuilder
  ) { }
  ngOnInit(): void {
    // @ts-ignore
    window.onGoogleLibraryLoad = () => {
      google.accounts.id.initialize({
        client_id: this.client_ID,
        callback: this.handleCredentialResponse.bind(this),
        auto_select: false,
        cancel_on_tap_outside: true
      });
      //@ts-ignore
      google.accounts.id.renderButton(
        //@ts-ignore
      document.getElementById("buttonDiv"),
        { theme: "outline", size: "large", width: "100%"}
      );
      // @ts-ignore
      google.accounts.id.prompt((notification: PromptMomentNotification) => {})
    };
  }

  async handleCredentialResponse(response : CredentialResponse) {
    console.log(response);
    await this.service.LoginWithGoogle(response.credential).subscribe(
      (x:any) => {
        localStorage.setItem('user', JSON.stringify(x.data));
        this._ngZone.run(() => {
          this.erroneo = false;
          this.SharedService.comprobarPermisos.next(!this.erroneo);
         /* let datos = JSON.parse(localStorage.getItem('user')||"");
          this.WebSocketService.emitEventInicioSesion('iniciarSesion',datos.nombre);*/
          this.router.navigate(['']);
        })
      },
      (error:any) => {
        console.log(error);
      }
    )
  }

  irARegistro() {
    this.router.navigate(['/auth/registro']);
  }

  login() {

    const passwd = Md5.hashStr(this.nuevoUsr.passwd);
    this.authHttsService.login({ email: this.nuevoUsr.email, passwd: passwd }).subscribe(resp => {

      if (resp.success) {
        localStorage.setItem('user', JSON.stringify(resp.data));
        this.erroneo = false;
        this.SharedService.comprobarPermisos.next(!this.erroneo);
       /* let datos = JSON.parse(localStorage.getItem('user')||"");
        this.WebSocketService.setQueryPayload(datos);
        this.WebSocketService.emitEventInicioSesion('iniciarSesion',datos.nombre);*/
        this.router.navigate(['']);
      }
      else this.erroneo = true;
    });
  }

  irARecPasswd() {
    this.router.navigate(['/auth/recuperacionpasswd']);
  }

  // public login_Google() {
  //   this.authHttsService.signOutExternal();
  //   this._ngZone.run(() => {
  //     this.router.navigate(['/']).then(() => window.location.reload());
  //   })
  // }
}
