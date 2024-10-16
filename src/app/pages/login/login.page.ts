import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup = this.fb.group({});

  constructor(private fb: FormBuilder, private navCtrl: NavController) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Método para iniciar sesión
  login() {
    if (this.loginForm.valid) {
      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;

      // Aquí va la lógica para el inicio de sesión (ejemplo de consola)
      console.log('Iniciando sesión con:', email, password);
    } else {
      console.log('Formulario inválido');
    }
  }

  // Redirección al registro
  goToRegister() {
    this.navCtrl.navigateForward('/register');
  }
}
