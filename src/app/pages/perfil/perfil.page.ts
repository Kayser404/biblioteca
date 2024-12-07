import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DbService } from 'src/app/services/db.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  usuario: any;
  usuarioOriginal: any; // Variable para almacenar los datos originales
  editMode: boolean = false;
  editType: 'info' | 'email' | 'password' | null = null;
  infoForm: FormGroup;
  emailForm: FormGroup;
  passwordForm: FormGroup;
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
    // Formulario para cambiar email
    this.emailForm = this.fb.group({
      email: [
        '',
        [Validators.required, Validators.email], // Validadores síncronos
        [this.emailValidator(this.db, this.auth.getIdUsuario())], // Validador asíncrono
      ],
      currentPassword: ['', [Validators.required]],
    });
    // Formulario para cambiar contraseña
    this.passwordForm = this.fb.group(
      {
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
        repPassword: ['', [Validators.required]],
        currentPassword: ['', [Validators.required]],
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
          this.emailForm.patchValue({ email: usuario.email });
          console.log('Datos del usuario cargados:', this.usuario);
        })
        .catch((error: any) => {
          console.error('Error al cargar los datos del usuario:', error);
        });
    }
  }

  emailValidator(db: DbService, idUsuarioActual: string | null) {
    return async (control: AbstractControl) => {
      const email = control.value;

      if (!email) {
        return null; // Si el campo está vacío, no validar
      }

      try {
        const res = await db.verificarEmailExistente(email);
        if (res.rows.length > 0) {
          const usuarioId = res.rows.item(0).id_usuario;
          if (usuarioId !== idUsuarioActual) {
            // El email pertenece a otro usuario
            return { emailExistente: true };
          }
        }
        return null; // Email válido
      } catch (error) {
        console.error('Error al verificar el email:', error);
        return { errorVerificandoEmail: true }; // Error inesperado
      }
    };
  }

  async takePicture() {
    const image2 = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,
    });
    this.infoForm.patchValue({ foto: image2.dataUrl });
  }

  clearPhoto() {
    this.infoForm.patchValue({ foto: '' });
  }

  startEdit(type: 'info' | 'email' | 'password') {
    this.editMode = true;
    this.editType = type;

    if (type === 'info') {
      this.infoForm.reset(this.usuario);
    } else if (type === 'email') {
      this.emailForm.reset({
        email: this.usuario.email,
        currentPassword: '',
      });
    } else if (type === 'password') {
      this.passwordForm.reset({
        newPassword: '',
        repPassword: '',
        currentPassword: '',
      });
    }
  }

  cancelEdit() {
    this.editMode = false;

    if (this.editType === 'info') {
      this.infoForm.reset(this.usuario); // Resetea únicamente el formulario de información
    } else if (this.editType === 'email') {
      this.emailForm.reset({
        email: this.usuario.email,
        currentPassword: '', // Contraseña actual vacía
      }); // Resetea únicamente el formulario de email
    } else if (this.editType === 'password') {
      this.passwordForm.reset({
        newPassword: '',
        repPassword: '',
        currentPassword: '', // Contraseña actual vacía
      }); // Resetea únicamente el formulario de contraseña
    }

    this.editType = null; // Limpia el tipo de edición activo
  }

  verificarContraseñaActual(currentPassword: string): Promise<boolean> {
    return new Promise((resolve) => {
      const storedPassword = this.usuarioOriginal.password;
      resolve(currentPassword === storedPassword);
    });
  }

  saveEmailChanges() {
    if (this.usuario) {
      // Actualiza el objeto usuario con los valores del formulario
      this.usuario.email = this.emailForm.value.email;
      const currentPassword = this.emailForm.value.currentPassword;

      // Detecta los cambios entre los valores actuales y originales
      const cambios = this.detectarCambios(this.usuario, this.usuarioOriginal);

      if (cambios.length > 0) {
        this.verificarContraseñaActual(currentPassword).then((esValido) => {
          if (esValido) {
            this.db
              .actualizarUsuario(this.usuario, cambios)
              .then(() => {
                this.editMode = false; // Salir del modo de edición después de guardar

                // Después de guardar, actualizamos el objeto usuarioOriginal para futuras comparaciones
                this.usuarioOriginal = { ...this.usuario }; // Clonamos los valores actuales como los valores originales
              })
          } else {
            this.errorMessages.password = 'contraseña incorrecta';
          }
        });
      } else {
        console.log('No se han realizado cambios en el perfil.');
      }
    }
  }

  savePasswordChanges() {
    if (this.usuario) {
      // Actualiza el objeto usuario con los valores del formulario
      this.usuario.password = this.passwordForm.value.newPassword;
      const currentPassword = this.passwordForm.value.currentPassword;

      // Detecta los cambios entre los valores actuales y originales
      const cambios = this.detectarCambios(this.usuario, this.usuarioOriginal);

      if (cambios.length > 0) {
        this.verificarContraseñaActual(currentPassword).then((esValido) => {
          if (esValido) {
            this.db
              .actualizarUsuario(this.usuario, cambios)
              .then(() => {
                this.editMode = false; // Salir del modo de edición después de guardar

                // Después de guardar, actualizamos el objeto usuarioOriginal para futuras comparaciones
                this.usuarioOriginal = { ...this.usuario }; // Clonamos los valores actuales como los valores originales
              })
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

  passwordsMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const newPassword = group.get('newPassword')?.value;
    const repPassword = group.get('repPassword')?.value;

    if (newPassword && repPassword && newPassword !== repPassword) {
      return { passwordsMismatch: true };
    }
    return null;
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

  getFechaNacimientoMessage() {
    const fechaNacimientoControl = this.infoForm.get('fechaNacimiento');

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
    const emailControl = this.emailForm.controls['email'];

    if (emailControl.hasError('required')) {
      return 'Este campo es requerido.';
    }
    if (emailControl.hasError('email')) {
      return 'Formato de email inválido.';
    }
    if (emailControl.hasError('pattern')) {
      return 'Formato de email inválido.';
    }
    if (emailControl.hasError('emailExistente')) {
      return 'Este email ya está en uso.';
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
    const contrasenaControl = this.passwordForm.controls['newPassword'];

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
    const repPasswordControl = this.passwordForm.get('repPassword');
    if (repPasswordControl?.hasError('required')) {
      return 'Debes confirmar la contraseña.';
    }
    if (this.infoForm.hasError('passwordsMismatch')) {
      return 'Las contraseñas no coinciden.';
    }
    return '';
  }
}
