import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DbService } from 'src/app/services/db.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-registro-usuario',
  templateUrl: './registro-usuario.page.html',
  styleUrls: ['./registro-usuario.page.scss'],
})
export class RegistroUsuarioPage implements OnInit {

  registroForm: FormGroup;

  preguntasSeguridad: string[] = [
    '¿Cuál es el nombre de tu primera mascota?',
    '¿Cuál es tu color favorito?',
    '¿Cuál es el nombre de tu mejor amigo?',
  ];

  constructor(private fb: FormBuilder, private db: DbService, private router: Router) {
    // Inicializamos el formulario
    this.registroForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      repPassword: ['', Validators.required],
      nombreUsuario: ['', Validators.required],
      apellidoUsuario: ['', Validators.required],
      edadUsuario: ['', [Validators.required, Validators.min(0)]],
      pregunta: ['', Validators.required],
      respuesta: ['', Validators.required],
    }, { validator: this.passwordsMatchValidator });
  }

  ngOnInit() {}

  // Validador personalizado para verificar que las contraseñas coincidan
  passwordsMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const repPassword = form.get('repPassword')?.value;

    return password === repPassword ? null : { passwordsMismatch: true };
  }

  enviar() {
    // Capturar los valores del formulario
    const email = this.registroForm.value.email;
    const password = this.registroForm.value.password;
    const nombreUsuario = this.registroForm.value.nombreUsuario;
    const apellidoUsuario = this.registroForm.value.apellidoUsuario;
    const edadUsuario = this.registroForm.value.edadUsuario;
    const pregunta = this.registroForm.value.pregunta;
    const respuesta = this.registroForm.value.respuesta;

    // Si el formulario es válido, imprimir los valores
    if (this.registroForm.valid) {
      console.log('Formulario válido, enviando los siguientes datos:', this.registroForm.value);

      // Aquí iría la lógica para enviar los datos a la base de datos
      this.db.registrarUsuario(email, password, nombreUsuario, apellidoUsuario, edadUsuario)
        .then(idUsuario => {
          return this.db.agregarPreguntaRespuesta(pregunta, respuesta, idUsuario)
            .then(() => {
              console.log('Registro completo');
              this.router.navigate(['/login']);
            });
        })
        .catch(error => {
          console.error('Error al registrar el usuario:', error);
        });

    } else {
      console.log('Formulario inválido');
    }
  }
}