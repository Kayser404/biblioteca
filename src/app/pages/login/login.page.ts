import { Component, OnInit } from '@angular/core'; 
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  });

  errorMessages = {
    email: '',
    password: ''
  };

  usuarios: any[] = [];

  constructor(private fb: FormBuilder, private db: DbService, private router: Router) { }

  ngOnInit() {
    /* this.db.dbState().subscribe(res => {
      if (res) {
        this.db.fetchUsuario().subscribe(item => {
          // Filtramos el arreglo para omitir el rol de admin
          this.usuarios = item;
        });
      }
    }); */
  }

  // Método para iniciar sesión
  login() {
    if (this.loginForm.valid) {
      const emailControl = this.loginForm.value.email;
      const passwordControl = this.loginForm.value.password;
  
      if (emailControl && passwordControl) {
        const email = emailControl;
        const password = passwordControl;
  
        this.db.verificarCredenciales(email, password)
          .then((usuario) => {
            if (usuario) {
              // Aquí eliminamos la parte de roles y almacenamientos innecesarios
              localStorage.setItem('idUsuario', usuario.id_usuario);
              localStorage.setItem('rolId', usuario.rolFK);
  
              // Borrar inputs del formulario
              this.loginForm.patchValue({
                email: '',
                password: ''
              });

              // Redirigir a la página deseada después de iniciar sesión
              this.router.navigate(['/home']);
            } else {
              this.errorMessages.email = 'Email o contraseña inválidos';
              this.errorMessages.password = 'Email o contraseña inválidos';
            }
          })
          .catch(error => {
            // Manejar errores de la base de datos
            this.db.presentAlert("Error en la base de datos");
          });
      }
    } else {
      console.log('Formulario inválido');
    }
  }  

  // Redirección al registro
  goToRegister() {
    this.router.navigate(['/registro-usuario']);
  }
}
