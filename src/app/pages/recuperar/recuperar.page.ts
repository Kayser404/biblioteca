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
  preguntasSeguridad: string[] = [
    '¿Cuál es el nombre de tu primera mascota?',
    '¿Cuál es tu color favorito?',
    '¿Cuál es el nombre de tu mejor amigo?',
  ];

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
    pregunta: ['', [Validators.required]],
    respuesta: ['', [Validators.required]],
  });

  preguntaRespuesta: { pregunta: string; respuesta: string } | null = null;
  pregunta: string | null = null;
  idUsuario: number | null = null;

  respuestaError: string = '';

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private db: DbService
  ) {}

  ngOnInit() {}

  enviar() {
    if (this.emailForm.valid) {
      const email = this.emailForm.value.email;
      this.db
        .verificarEmail(email)
        .then((idUsuario) => {
          if (idUsuario) {
            this.idUsuario = idUsuario; // Guardar el ID del usuario
            this.db
              .obtenerPreguntaRespuesta(idUsuario)
              .then((preguntaRespuesta) => {
                if (preguntaRespuesta) {
                  this.preguntaRespuesta = preguntaRespuesta; // Almacenar pregunta y respuesta
                  this.pregunta = preguntaRespuesta.pregunta; // Mostrar la pregunta en la vista
                } else {
                  this.preguntaRespuesta = null; // Limpiar si no se encuentra nada
                  this.db.presentAlert(
                    'No se encontró una pregunta asociada a este usuario.'
                  );
                }
              });
          } else {
            this.db.presentAlert(
              'No existe una cuenta asociada a este correo.'
            );
          }
        })
        .catch((error) => {
          console.error('Error al verificar el correo:', error);
          this.db.presentAlert('Error en la base de datos.');
        });
    }
  }

  enviarRespuesta() {
    if (this.respuestaForm.valid) {
      const preguntaSeleccionada = this.respuestaForm.value.pregunta; // Pregunta seleccionada
      const respuestaIngresada = this.respuestaForm.value.respuesta; // Respuesta ingresada
  
      // Validar pregunta y respuesta
      if (
        preguntaSeleccionada === this.preguntaRespuesta?.pregunta &&
        respuestaIngresada === this.preguntaRespuesta?.respuesta
      ) {
        // Redirigir al usuario si todo es correcto
        this.router.navigate(['/nueva-contrasena', this.idUsuario]);
      } else {
        // Mostrar mensaje de error si no coinciden
        this.respuestaError =
          'La pregunta o la respuesta no son correctas. Inténtalo de nuevo.';
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
