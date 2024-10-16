import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DbService } from 'path/to/db.service'; // Ajusta la ruta
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-registro-usuario',
  templateUrl: './registro-usuario.page.html',
  styleUrls: ['./registro-usuario.page.scss'],
})
export class RegistroUsuarioPage implements OnInit {
  registroForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dbService: DbService,
    private alertController: AlertController
  ) {
    this.registroForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      nombreUsuario: ['', Validators.required],
      apellidoUsuario: ['', Validators.required],
      edadUsuario: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit() {}

  async registrarUsuario() {
    if (this.registroForm.valid) {
      const { email, password, nombreUsuario, apellidoUsuario, edadUsuario } = this.registroForm.value;
      const result = await this.dbService.registrarUsuario(email, password, nombreUsuario, apellidoUsuario, edadUsuario);

      if (result) {
        this.presentAlert('Usuario registrado con éxito');
        this.registroForm.reset(); // Resetea el formulario
      } else {
        this.presentAlert('Error al registrar usuario');
      }
    } else {
      this.presentAlert('Por favor, completa todos los campos correctamente');
    }
  }

  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Registro',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
