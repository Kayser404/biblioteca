import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DbService } from 'src/app/services/db.service';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

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
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(20),
        Validators.pattern('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\\-=\\[\\]{};:\'",.<>/?]).*$')
      ]],
      repPassword: ['', Validators.required],
      nombreUsuario: ['', [
        Validators.required, 
        Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')
      ]],
      apellidoUsuario: ['', [
        Validators.required, 
        Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')
      ]],
      fechaNacimiento: ['', [
        Validators.required,
        this.edadMayor,
        Validators.pattern(/^(\d{2}-\d{2}-\d{4})$/)
      ]],
      foto: [''],
      pregunta: ['', Validators.required],
      respuesta: ['', Validators.required],
    }, { validator: this.passwordsMatchValidator });    
  }

  ngOnInit() {}

  /* Camara */
  async takePicture() {
    const image2 = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt
    });
    this.registroForm.patchValue({ foto: image2.dataUrl });
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
    const fechaNacimiento = this.registroForm.value.fechaNacimiento;
    const foto = this.registroForm.value.foto;
    const pregunta = this.registroForm.value.pregunta;
    const respuesta = this.registroForm.value.respuesta;

    // Imprimir cada campo para verificar qué datos están entrando
    console.log('Datos ingresados:');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Nombre de usuario:', nombreUsuario);
    console.log('Apellido de usuario:', apellidoUsuario);
    console.log('Fecha de nacimiento:', fechaNacimiento);
    console.log('Pregunta de seguridad:', pregunta);
    console.log('Respuesta de seguridad:', respuesta);

    // Si el formulario es válido, imprimir los valores
    if (this.registroForm.valid) {
      console.log('Formulario válido, enviando los siguientes datos:', this.registroForm.value);

      // Aquí iría la lógica para enviar los datos a la base de datos
      this.db.registrarUsuario(email, password, nombreUsuario, apellidoUsuario, fechaNacimiento, foto)
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

  // Método para verificar si el correo ya existe
  async verificarEmail() {
    const email = this.registroForm.get('email')?.value;
  
    if (!email) {
      return; // Si no hay valor, no se verifica
    }
  
    try {
      const res = await this.db.verificarEmailExistente(email);
      if (res.rows.length > 0) {
        // Si el correo existe, establecer el error personalizado
        this.registroForm.get('email')?.setErrors({ emailExists: true });
      } else {
        // Si no existe, limpiar el error personalizado
        const currentErrors = this.registroForm.get('email')?.errors || {};
        delete currentErrors['emailExists'];
        this.registroForm.get('email')?.setErrors(Object.keys(currentErrors).length > 0 ? currentErrors : null);
      }
    } catch (error) {
      console.error('Error al verificar el correo:', error);
    }
  }  
    
  // Validación personalizada
  edadMayor(control: any) {
    const fechaNacimiento = control.value;
    if (!fechaNacimiento) {
      return null;
    }

    const partesFecha = fechaNacimiento.split('-');
    if (partesFecha.length !== 3) {
      return { formatoInvalido: true }; // Formato incorrecto
    }

    const dia = parseInt(partesFecha[0], 10);
    const mes = parseInt(partesFecha[1], 10);
    const anio = parseInt(partesFecha[2], 10);

    if (isNaN(dia) || isNaN(mes) || isNaN(anio)) {
      return { formatoInvalido: true };
    }

    if (mes < 1 || mes > 12) {
      return { mesInvalido: true };
    }

    const fechaNac = new Date(anio, mes - 1, dia);
    if (
      fechaNac.getFullYear() !== anio ||
      fechaNac.getMonth() !== mes - 1 ||
      fechaNac.getDate() !== dia
    ) {
      return { fechaInvalida: true };
    }

    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNac.getFullYear();

    if (
      hoy.getMonth() < fechaNac.getMonth() ||
      (hoy.getMonth() === fechaNac.getMonth() && hoy.getDate() < fechaNac.getDate())
    ) {
      edad--;
    }

    if (edad < 18) {
      return { edadMenor: true };
    }

    return null; // Válido
  }

  // Obtener mensajes de error
  getFechaNacimientoMessage() {
    const fechaNacimientoControl = this.registroForm.get('fechaNacimiento');

    if (fechaNacimientoControl?.hasError('required')) {
      return 'Este campo es requerido.';
    }
    if (fechaNacimientoControl?.hasError('pattern')) {
      return 'El formato de la fecha debe ser DD-MM-AAAA.';
    }
    if (fechaNacimientoControl?.hasError('formatoInvalido')) {
      return 'La fecha tiene un formato incorrecto.';
    }
    if (fechaNacimientoControl?.hasError('mesInvalido')) {
      return 'El mes debe estar entre 1 y 12.';
    }
    if (fechaNacimientoControl?.hasError('fechaInvalida')) {
      return 'La fecha no es válida.';
    }
    if (fechaNacimientoControl?.hasError('edadMenor')) {
      return 'Debes ser mayor de 18 años.';
    }
    return '';
  }


  getEmailMessage() {
    const emailControl = this.registroForm.controls['email'];
  
    if (emailControl.hasError('required')) {
      return 'Este campo es requerido.';
    }
    if (emailControl.hasError('email')) {
      return 'Formato de email inválido.';
    }
    if (emailControl.hasError('pattern')) {
      return 'Formato de email inválido.';
    }
    if (emailControl.hasError('emailExists')) {
      return 'Este correo ya está registrado.';
    }
    return '';
  }  

  // Validación Nombre
  getNombresMessage() {
    const nombresControl = this.registroForm.get('nombreUsuario');
  
    if (nombresControl && nombresControl.hasError('required')) {
      return 'Este campo es requerido.';
    }
    if (nombresControl && nombresControl.hasError('pattern')) {
      return 'Ingrese nombres válidos.';
    }
    return '';
  }
  
  // Validación Apellido
  getApellidosMessage() {
    const apellidosControl = this.registroForm.get('apellidoUsuario');
  
    if (apellidosControl && apellidosControl.hasError('required')) {
      return 'Este campo es requerido.';
    }
    if (apellidosControl && apellidosControl.hasError('pattern')) {
      return 'Ingrese apellidos válidos.';
    }
    return '';
  }  

  // Validación Contraseña
  getContrasenaMessage() {
    const contrasenaControl = this.registroForm.controls['password'];

    if (contrasenaControl.hasError('required')) {
      return 'Este campo es requerido.';
    }
    if (contrasenaControl.hasError('minLength')) {
      return 'La contraseña debe tener al menos 8 caracteres.';
    }

    if (contrasenaControl.hasError('maxLength')) {
      return 'La contraseña debe tener como máximo 25 caracteres.';
    }
    if (contrasenaControl.hasError('pattern')) {
      return 'La contraseña debe contener al menos una letra minúscula, una letra mayúscula, un numero y un carácter especial.';
    }

    return '';
  }

  // Validación Repetir Contraseña
  getRepetirContrasenaMessage() {
    const repPasswordControl = this.registroForm.get('repPassword');
    if (repPasswordControl?.hasError('required')) {
      return 'Debes confirmar la contraseña.';
    }
    if (this.registroForm.hasError('passwordsMismatch')) {
      return 'Las contraseñas no coinciden.';
    }
    return '';
  }

}