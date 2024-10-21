import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DbService } from 'src/app/services/db.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-editar-libro',
  templateUrl: './editar-libro.page.html',
  styleUrls: ['./editar-libro.page.scss'],
})
export class EditarLibroPage implements OnInit {
  libroForm: FormGroup;
  categorias: any[] = [];
  libro: any;

  constructor(
    private fb: FormBuilder,
    private db: DbService,
    private router: Router
  ) {
    this.libroForm = this.fb.group({
      titulo: ['', Validators.required],
      sinopsis: ['', Validators.required],
      foto: [''],
      pdf: [''],
      categoriaFK: ['', Validators.required]
    });
  }

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state && navigation.extras.state['libro']) {
      this.libro = navigation.extras.state['libro'];
      if (this.libro) {
        this.libroForm.patchValue(this.libro);
      } else {
        console.error('No se encontró el libro en el estado de navegación.');
      }
    } else {
      console.error('No se encontró el libro en el estado de navegación.');
    }
    this.db.dbState().subscribe(res => {
      if (res) {
        this.db.fetchCategoria().subscribe(item => {
          this.categorias = item;
        });
      }
    });
  }

  async takePicture() {
    const image2 = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt
    });
    this.libroForm.patchValue({ foto: image2.dataUrl });
  }

  guardarCambios() {
    if (this.libroForm.valid) {
      const { titulo, sinopsis, foto, pdf, categoriaFK } = this.libroForm.value;
      const idPublicacion = this.libro.idPublicacion;

      this.db.actualizarPublicacion(titulo, sinopsis, foto, pdf, categoriaFK, idPublicacion)
        .then(res => {
          if (res) {
            console.log('Cambios guardados correctamente');
            this.router.navigate(['/lista-libro']);
          } else {
            console.error('Error al guardar los cambios');
          }
        })
        .catch(error => console.error('Error durante la actualización:', error));
    } else {
      console.error('El formulario no es válido:', this.libroForm.errors);
    }
  }
}
