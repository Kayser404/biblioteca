import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DbService } from 'src/app/services/db.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  usuario: any;
  usuarioOriginal: any; // Variable para almacenar los datos originales
  editMode: boolean = false;
  editType: 'info' | 'security' = 'info';
  infoForm: FormGroup;
  securityForm: FormGroup;
  errorMessages: { password: string } = { password: '' };

  constructor(
    private auth: AuthService,
    private db: DbService,
    private fb: FormBuilder
  ) {
    this.infoForm = this.fb.group({
      nombreUsuario: [
        '',
        [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')],
      ],
      apellidoUsuario: [
        '',
        [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')],
      ],
      fechaNacimiento: [
        '',
        [
          Validators.required,
          this.edadMayor,
          Validators.pattern(/^(\d{2}-\d{2}-\d{4})$/),
        ],
      ],
      foto: [''],
    });
    this.securityForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        currentPassword: ['', [Validators.required]],
        newPassword: [
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
        repPassword: ['', Validators.required],
      },
      { validator: this.passwordsMatchValidator }
    );
  }

  ngOnInit() {
    const idUsuario = this.auth.getIdUsuario();
    if (idUsuario) {
      this.db
        .obtenerUsuarioPorId(idUsuario)
        .then((usuario) => {
          this.usuario = usuario;
          this.usuarioOriginal = { ...usuario };
          this.infoForm.patchValue({
            nombreUsuario: usuario.nombreUsuario,
            apellidoUsuario: usuario.apellidoUsuario,
            fechaNacimiento: usuario.edadUsuario,
            foto: usuario.foto,
          });
          this.securityForm.patchValue({ email: usuario.email });
          console.log('Datos del usuario cargados:', this.usuario);
        })
        .catch((error: any) => {
          console.error('Error al cargar los datos del usuario:', error);
        });
    }
  }

  async takePicture() {
    const image2 = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt
    });
    this.infoForm.patchValue({ foto: image2.dataUrl });
  }

  clearPhoto() {
    this.infoForm.patchValue({ foto: '' });
  }  

  startEdit(type: 'info' | 'security') {
    this.editMode = true;
    this.editType = type;
  }

  cancelEdit() {
    this.editMode = false;
    this.infoForm.reset(this.usuario);
    this.securityForm.reset(this.usuario);
  }

  verificarContraseñaActual(currentPassword: string): Promise<boolean> {
    return new Promise((resolve) => {
      const storedPassword = this.usuarioOriginal.password;
      resolve(currentPassword === storedPassword);
    });
  }

  saveSecurityChanges() {
    if (this.usuario) {
      // Actualiza el objeto usuario con los valores del formulario
      this.usuario.email = this.securityForm.value.email;
      this.usuario.password = this.securityForm.value.newPassword;
      const currentPassword = this.securityForm.value.currentPassword;

      // Detecta los cambios entre los valores actuales y originales
      const cambios = this.detectarCambios(this.usuario, this.usuarioOriginal);

      if (cambios.length > 0) {
        this.verificarContraseñaActual(currentPassword).then((esValido) => {
          if (esValido) {
            this.db
              .actualizarUsuario(this.usuario, cambios)
              .then(() => {
                console.log('Perfil actualizado correctamente.');
                this.editMode = false; // Salir del modo de edición después de guardar
                this.usuarioOriginal = { ...this.usuario };
              })
              .catch((error: any) => {
                console.error('Error al actualizar el perfil:', error);
              });
          } else {
            this.errorMessages.password = 'contraseña incorrecta';
          }
        });
      } else {
        console.log('No se han realizado cambios en el perfil.');
      }
    }
  }

  saveChanges() {
    if (this.usuario) {
      // Actualiza el objeto usuario con los valores del formulario
      this.usuario.nombreUsuario = this.infoForm.value.nombreUsuario;
      this.usuario.apellidoUsuario = this.infoForm.value.apellidoUsuario;
      this.usuario.edadUsuario = this.infoForm.value.fechaNacimiento;
      this.usuario.foto = this.infoForm.value.foto;

      // Detecta los cambios entre los valores actuales y originales
      const cambios = this.detectarCambios(this.usuario, this.usuarioOriginal);

      if (cambios.length > 0) {
        // Llamar a la función para actualizar solo los campos modificados
        this.db
          .actualizarUsuario(this.usuario, cambios)
          .then(() => {
            console.log('Perfil actualizado correctamente.');
            this.editMode = false; // Salir del modo de edición después de guardar

            // Después de guardar, actualizamos el objeto usuarioOriginal para futuras comparaciones
            this.usuarioOriginal = { ...this.usuario }; // Clonamos los valores actuales como los valores originales
          })
          .catch((error: any) => {
            console.error('Error al actualizar el perfil:', error);
          });
      } else {
        console.log('No se han realizado cambios en el perfil.');
      }
    }
  }

  // Detectar qué campos han sido modificados
  detectarCambios(usuarioModificado: any, usuarioOriginal: any) {
    const cambios = [];
    for (const campo in usuarioModificado) {
      if (usuarioModificado[campo] !== usuarioOriginal[campo]) {
        cambios.push(campo);
      }
    }
    return cambios;
  }

  passwordsMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const repPassword = form.get('repPassword')?.value;
    return newPassword === repPassword ? null : { passwordsMismatch: true };
  }

  // Validación Fecha de Nacimiento
  edadMayor(control: any) {
    const fechaNacimiento = control.value;
    if (!fechaNacimiento) {
      return null;
    }

    const partesFecha = fechaNacimiento.split('-');
    const dia = parseInt(partesFecha[0], 10);
    const mes = parseInt(partesFecha[1], 10) - 1;
    const anio = parseInt(partesFecha[2], 10);

    const fechaNac = new Date(anio, mes, dia);
    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNac.getFullYear();

    if (
      hoy.getMonth() + 1 < mes ||
      (hoy.getMonth() + 1 === mes && hoy.getDate() < dia)
    ) {
      edad--;
    }

    if (edad < 18) {
      return { edadMenor: true };
    }
    return null;
  }

  getFechaNacimientoMessage() {
    const fechaNacimientoControl = this.infoForm.controls['fechaNacimiento'];

    if (fechaNacimientoControl.hasError('required')) {
      return 'Este campo es requerido.';
    }
    if (fechaNacimientoControl.hasError('pattern')) {
      return 'El formato de la fecha de nacimiento debe ser DD-MM-AAAA.';
    }
    if (fechaNacimientoControl.hasError('edadMenor')) {
      return 'Debes ser mayor de 18 años.';
    }
    return '';
  }

  getEmailMessage() {
    const emailControl = this.securityForm.controls['email'];

    if (emailControl.hasError('required')) {
      return 'Este campo es requerido.';
    }
    if (emailControl.hasError('email')) {
      return 'Formato de email inválido.';
    }
    if (emailControl.hasError('pattern')) {
      return 'Formato de email inválido.';
    }
    return '';
  }

  // Validación Nombre
  getNombresMessage() {
    const nombresControl = this.infoForm.get('nombreUsuario');

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
    const apellidosControl = this.infoForm.get('apellidoUsuario');

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
    const contrasenaControl = this.securityForm.controls['newPassword'];

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
    const repPasswordControl = this.securityForm.get('repPassword');
    if (repPasswordControl?.hasError('required')) {
      return 'Debes confirmar la contraseña.';
    }
    if (this.infoForm.hasError('passwordsMismatch')) {
      return 'Las contraseñas no coinciden.';
    }
    return '';
  }
}
