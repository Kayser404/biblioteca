import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DbService } from 'src/app/services/db.service';
import { AuthService } from 'src/app/services/auth.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Router } from '@angular/router';
import {Filesystem, Directory} from '@capacitor/filesystem';


@Component({
  selector: 'app-registrar-libro',
  templateUrl: './registrar-libro.page.html',
  styleUrls: ['./registrar-libro.page.scss'],
})
export class RegistrarLibroPage implements OnInit {
  publicacionForm: FormGroup;
  categorias: any[] = [];
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder, private db: DbService, private auth: AuthService, private router: Router) {
    this.publicacionForm = this.fb.group({
      titulo: ['', Validators.required],
      sinopsis: ['', Validators.required],
      fotoPublicacion: ['', Validators.required],
      pdf: ['', Validators.required],
      categoria: ['', Validators.required],
    
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

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    this.selectedFile = file;
    this.publicacionForm.patchValue({ pdf: file });
  }  

  async guardarArchivoPDF(file: File): Promise<string> {
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      return new Promise((resolve, reject) => {
        reader.onload = async () => {
          const base64Data = reader.result as string;
          const fileName = `${new Date().getTime()}.pdf`;

          const result = await Filesystem.writeFile({
            path: `pdfs/${fileName}`,
            data: base64Data.split(',')[1],
            directory: Directory.Data,
            recursive: true
          });

          resolve(result.uri);
        };

        reader.onerror = (error) => reject(error);
      });
    } catch (error) {
      console.error('Error al guardar el archivo PDF:', error);
      throw error;
    }
  }

  /* Camara */
  async takePicture() {
    const image2 = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt
    });
    this.publicacionForm.patchValue({ fotoPublicacion: image2.dataUrl });
  }
  
  async enviar() {
    if (this.publicacionForm.valid && this.selectedFile) {
      const titulo = this.publicacionForm.value.titulo;
      const sinopsis = this.publicacionForm.value.sinopsis;
      const fechaPublicacion = new Date().toLocaleDateString('es-ES');
      const fotoPublicacion = this.publicacionForm.value.fotoPublicacion;
      const idUsuario = this.auth.getIdUsuario();
      const categoria = this.publicacionForm.value.categoria;
    
      try {
        // Guardar el archivo PDF y obtener su URI
        const pdfUri = await this.guardarArchivoPDF(this.selectedFile);
        
        // Establecer la URI del PDF en el campo del formulario
        this.publicacionForm.patchValue({ pdf: pdfUri });
        
        // Guardar la publicación en la base de datos usando el valor del formulario
        this.db.agregarPublicacion(
          titulo,
          sinopsis,
          fechaPublicacion,
          fotoPublicacion,
          this.publicacionForm.value.pdf, // Usar la URI del PDF desde el formulario
          idUsuario,
          categoria
        ).then(() => {
          console.log('Publicación guardada con éxito');
          console.log('URI del archivo PDF:', pdfUri);
          this.router.navigate(['/lista-libro']);
        }).catch(error => {
          console.error('Error al guardar la publicación:', error);
        });
      } catch (error) {
        console.error('Error al guardar el archivo PDF:', error);
      }
    } else {
      console.log('Formulario inválido');
    }
  }  
  
}