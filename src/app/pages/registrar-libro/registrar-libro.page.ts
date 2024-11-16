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
      foto: ['', Validators.required],
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
    if (file && file.type === 'application/pdf') {
      this.selectedFile = file;
      console.log('Archivo PDF seleccionado:', this.selectedFile?.name);
      this.publicacionForm.patchValue({ pdf: file });
      this.publicacionForm.get('pdf')?.markAsTouched();  // Marca el campo como tocado
    } else {
      console.error('Por favor, selecciona un archivo PDF válido.');
      this.selectedFile = null;
      this.publicacionForm.patchValue({ pdf: null });
      this.publicacionForm.get('pdf')?.markAsTouched();  // Marca el campo como tocado
    }
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
  takePicture = async () => {
    const image2 = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt
    });
    
    if (image2.dataUrl) {
      console.log('Imagen capturada:', image2.dataUrl);
      this.publicacionForm.patchValue({ foto: image2.dataUrl });
      this.publicacionForm.get('foto')?.markAsTouched();  // Marca el campo como tocado
    } else {
      this.publicacionForm.patchValue({ foto: null });
      this.publicacionForm.get('foto')?.markAsTouched();  // Marca el campo como tocado
    }
  };
  
  async enviar() {
    if (this.publicacionForm.valid && this.selectedFile) {
      const titulo = this.publicacionForm.value.titulo;
      const sinopsis = this.publicacionForm.value.sinopsis;
      const fechaPublicacion = new Date().toLocaleDateString('es-ES');
      const foto = this.publicacionForm.value.foto;
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
          foto,
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