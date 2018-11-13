import { Component, OnInit } from '@angular/core';
import { User } from './models/user';
import { UserService} from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [UserService]
})

export class AppComponent implements OnInit{
  public title = 'Musicfy';
  public user: User;
  public user_register: User;
  public identity;
  public token;
  public errorMessage;
  public alertRegister;

  constructor(
    private _userService: UserService
  ){
    this.user = new User('','','','','','ROLE_USER','');
    this.user_register = new User('','','','','','ROLE_USER','');
  }

  public onSubmit(){

    console.log(this.user);
    //Conseguir los datos del Usuario identificado
    this._userService.signup(this.user).subscribe(
      response => {
        let identity = response.user;
        this.identity = identity;
        if(!this.identity){ //se modifico identity._id
          alert('El Usuario no esta correctamente identificado');
        }else{
          //Crear elemento en el localstorage para tener la sesion de usuario
          localStorage.setItem('identity',JSON.stringify(identity));
          //Conseguir el Token para enviarselo a cada sesion
          this._userService.signup(this.user,'true').subscribe(
            response => {
              let token = response.token;
              this.token = token;
              if(this.token.length <= 0){
                alert('El Token no se ha iniciado correctamente');
              }else{
                //Crear elemento en el localstorage para tener el token disponible
                localStorage.setItem('token',token);
                this.user = new User('','','','','','ROLE_USER','');
              }
              console.log(response);
            }, error => {
              var errorMessage = <any>error;
              if(errorMessage != null){
                var body = JSON.parse(error._body);
                this.errorMessage = body.message;
                console.log(this.errorMessage);
              }
            });
        }
        console.log(response);
      }, error => {
        var errorMessage = <any>error;
        if(errorMessage != null){
          var body = JSON.parse(error._body);
          this.errorMessage = body.message;
          console.log(this.errorMessage);
        }
      });
  }



  onSubmitRegister(){
    //console.log(this.user_register);
    this._userService.register(this.user_register).subscribe(
      response => {
        let user = response.user;
        this.user_register = user;
        if(!user._id){
          this.alertRegister = 'Se ha producido un error al Registrar usuario';
        }else{
          this.alertRegister = 'El registro se ha realizado correctamente. identificate con ' + this.user_register.email;
          this.user_register = new User('','','','','','ROLE_USER','');
        }
      }
      , error => {
        var errorMessage = <any>error;
        if(errorMessage != null){
          var body = JSON.parse(error._body);
          this.alertRegister = body.message;
          console.log(this.errorMessage);
        }
      });
    }


  logout(){
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
    localStorage.clear();
    this.identity = null;
    this.token = null;
  }

  ngOnInit(){
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    console.log(this.identity);
    console.log(this.token);
  }

}
