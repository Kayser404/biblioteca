import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.page.html',
  styleUrls: ['./recuperar.page.scss'],
})
export class RecuperarPage implements OnInit {
  async canDismiss(data?: any, role?: string) {
    return role !== 'gesture';
  }

  isModalOpen = false;

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  emailForm = this.formBuilder.group({
    email: [
      '',
      [
        Validators.required,
        Validators.email,
        Validators.pattern('[_.a-zA-Z0-9.]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}'),
      ],
    ],
  });

  respuestaForm = this.formBuilder.group({
    respuesta: ['', [Validators.required]],
  });

  preguntaRespuesta: any = {};

  respuestaError: string = '';

  idUsuario: any;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private db: DbService,
    private modalCtrl: ModalController
  ) {
    this.preguntaRespuesta = {};
    this.idUsuario = null;
  }

  ionViewWillEnter() {
    // Cierra el modal cuando esta página se está cargando
    this.modalCtrl.dismiss();
  }

  ngOnInit() {}

  /* Metodo para enviar */
  enviar() {
    if (this.emailForm.valid) {
      const emailControl = this.emailForm.value.email;
      if (emailControl) {
        const email = emailControl;
        // Realiza una solicitud a tu servicio para verificar el correo
        this.db
          .verificarEmail(email)
          .then((idUsuario) => {
            if (idUsuario) {
              this.idUsuario = idUsuario;
              this.db
                .obtenerPreguntaRespuesta(idUsuario)
                .then((preguntaRespuesta) => {
                  if (preguntaRespuesta) {
                    // Procesar y mostrar las preguntas y respuestas en el modal
                    this.preguntaRespuesta = preguntaRespuesta;
                    this.setOpen(true);
                  } else {
                    // No se encontraron registros para el usuario
                    /* this.db.presentAlert("No existen preguntas y respuestas asociadas al usuario"); */
                  }
                });
            } else {
              /* this.db.presentAlert("No existe una cuenta asociada al correo"); */
            }
          })
          .catch((error) => {
            // Manejar errores de la base de datos
            /* this.db.presentAlert("Error en la base de datos"); */
          });
      }
    }
  }
  enviarRespuesta() {
    if (this.respuestaForm.valid) {
      const respuestaIngresada = this.respuestaForm.value.respuesta;
      if (respuestaIngresada === this.preguntaRespuesta.respuesta) {
        this.router.navigate(['/nueva-contrasena', this.idUsuario]);
        this.modalCtrl.dismiss();
      } else {
        this.respuestaError =
          'La respuesta no es correcta. Por favor, inténtalo de nuevo.';
      }
    }
  }
  getCorreoMessage() {
    const emailControl = this.emailForm.controls.email;

    if (emailControl.hasError('required')) {
      return 'Este campo es requerido*';
    }
    if (emailControl.hasError('email')) {
      return 'El formato del correo electrónico no es válido.';
    }
    if (emailControl.hasError('pattern')) {
      return 'El formato del correo electrónico no es válido.';
    }
    return '';
  }
}
