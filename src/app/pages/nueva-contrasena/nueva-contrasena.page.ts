import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { DbService } from 'src/app/services/db.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-nueva-contrasena',
  templateUrl: './nueva-contrasena.page.html',
  styleUrls: ['./nueva-contrasena.page.scss'],
})
export class NuevaContrasenaPage implements OnInit {
  passwordForm = this.formBuilder.group({
    contrasenia: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(20),
        Validators.pattern(
          '^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\\-=\\[\\]{};:\'",.<>/?]).*$'
        ),
      ],
    ],
    repetirContrasenia: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(20),
        Validators.pattern(
          '^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\\-=\\[\\]{};:\'",.<>/?]).*$'
        ),
      ],
    ],
  });

  idUsuario: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private db: DbService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.idUsuario = params['idUsuario'];
    });
  }

  async enviar() {
    if (this.passwordForm.valid) {
      const alert = await this.alertController.create({
        header: 'Confirmación',
        message: '¿Estás seguro de modificar la contraseña?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
              // El usuario canceló, no se modifica la contraseña
            },
          },
          {
            text: 'Aceptar',
            handler: () => {
              const password = this.passwordForm.value.contrasenia;
              this.db.modificarContrasena(this.idUsuario, password);
              this.router.navigate(['/login']);
            },
          },
        ],
      });

      await alert.present();
    }
  }

  /* Validar contrasenia */
  getContraseniaMessage() {
    const contraseniaControl = this.passwordForm.controls.contrasenia;

    if (contraseniaControl.hasError('required')) {
      return 'Este campo es requerido*';
    }

    if (contraseniaControl.hasError('minlength')) {
      return 'La contraseña debe tener al menos 8 caracteres';
    }

    if (contraseniaControl.hasError('maxlength')) {
      return 'La contraseña debe tener máximo 20 caracteres';
    }

    if (contraseniaControl.hasError('pattern')) {
      return 'La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial';
    }

    return '';
  }

  getRepetirContraseniaMessage() {
    const contraseniaControl = this.passwordForm.controls.contrasenia;
    const repetirContraseniaControl =
      this.passwordForm.controls.repetirContrasenia;

    if (repetirContraseniaControl.hasError('required')) {
      return 'Este campo es requerido*';
    }

    if (repetirContraseniaControl.value !== contraseniaControl.value) {
      return 'Las contraseñas no coinciden';
    }

    return '';
  }
}
