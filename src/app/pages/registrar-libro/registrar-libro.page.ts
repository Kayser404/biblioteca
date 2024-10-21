import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DbService } from 'src/app/services/db.service';
import { AuthService } from 'src/app/services/auth.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registrar-libro',
  templateUrl: './registrar-libro.page.html',
  styleUrls: ['./registrar-libro.page.scss'],
})
export class RegistrarLibroPage implements OnInit {
  publicacionForm: FormGroup;
  categorias: any[] = [];

  constructor(private fb: FormBuilder, private db: DbService, private auth: AuthService, private router: Router) {
    this.publicacionForm = this.fb.group({
      titulo: ['', Validators.required],
      sinopsis: ['', Validators.required],
      foto: [''],
      pdf: [''],
      id_categoriaFK: [null, Validators.required],
    
    });
  }

  ngOnInit() {
    this.db.dbState().subscribe(res => {
      if (res) {
        this.db.fetchCategoria().subscribe(item => {
          // Filtramos el arreglo para omitir el rol de admin
          this.categorias= item;
        });
      }
    });
  }
  
  /* Camara */
  takePicture = async () => {
    const image2 = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt
    });
    console.log('Imagen capturada:', image2.dataUrl);
    this.publicacionForm.patchValue({ foto: image2.dataUrl });
  };
  
  enviar() {
    if (this.publicacionForm.valid) {
      const titulo = this.publicacionForm.value.titulo;
      const sinopsis = this.publicacionForm.value.sinopsis;
      const fechaPublicacion = new Date().toLocaleDateString('es-ES');
      const foto = this.publicacionForm.value.foto;
      const pdf = this.publicacionForm.value.pdf;
      const idUsuario = this.auth.getIdUsuario();
      const categoria = this.publicacionForm.value.categoria;
      

      // Guardar la publicación en la base de datos
      this.db.agregarPublicacion(titulo, sinopsis, fechaPublicacion, foto, pdf, idUsuario, categoria)
        .then(() => {
          console.log('Publicación guardada con éxito');
          this.router.navigate(['/lista-libro']);
        })
        .catch(error => {
          console.error('Error al guardar la publicación:', error);
        });
    } else {
      console.log('Formulario inválido');
    }
  }
}