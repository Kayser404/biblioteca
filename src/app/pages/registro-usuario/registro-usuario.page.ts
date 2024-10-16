import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-registro-usuario',
  templateUrl: './registro-usuario.page.html',
  styleUrls: ['./registro-usuario.page.scss'],
})
export class RegistroUsuarioPage implements OnInit {
  
  registroForm: FormGroup;

  arregloRol: any[] = [];

  preguntasSeguridad: string[] = [
    '¿Cuál es el nombre de tu primera mascota?',
    '¿Cuál es tu color favorito?',
    '¿Cuál es el nombre de tu mejor amigo?',
  ];

  constructor(private fb: FormBuilder, private db: DbService) {
    // Inicializamos el formulario
    this.registroForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      repPassword: ['', Validators.required],
      nombreUsuario: ['', Validators.required],
      apellidoUsuario: ['', Validators.required],
      edadUsuario: ['', [Validators.required, Validators.min(0)]],
      roles: [[], Validators.required], // Almacena los roles seleccionados como un arreglo
      pregunta: ['', Validators.required],
      respuesta: ['', Validators.required],
    }, { validator: this.passwordsMatchValidator });
  }

  ngOnInit() {
    this.db.dbState().subscribe(res => {
      if (res) {
        this.db.fetchRol().subscribe(item => {
          // Filtramos el arreglo para omitir el rol de admin
          this.arregloRol = item.filter(rol => rol.nombreRol !== 'admin');
        });
      }
    });
  }

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
    const roles = this.registroForm.value.roles;
    const pregunta = this.registroForm.value.pregunta;
    const respuesta = this.registroForm.value.respuesta;

    // Si el formulario es válido, imprimir los valores
    if (this.registroForm.valid) {
      console.log('Formulario válido, enviando los siguientes datos:');
      console.log({
        email,
        password,
        nombreUsuario,
        apellidoUsuario,
        edadUsuario,
        roles,
        pregunta,
        respuesta,
      });

      // Aquí iría la lógica para enviar los datos a la base de datos
      // this.db.registrarUsuario({ email, password, nombreUsuario, apellidoUsuario, edadUsuario}).subscribe(...);
    } else {
      console.log('Formulario inválido');
    }
  }
}
