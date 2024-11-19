import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DbService } from 'src/app/services/db.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import {Filesystem, Directory} from '@capacitor/filesystem';

@Component({
  selector: 'app-editar-libro',
  templateUrl: './editar-libro.page.html',
  styleUrls: ['./editar-libro.page.scss'],
})
export class EditarLibroPage implements OnInit {
  libroForm: FormGroup;
  categorias: any[] = [];
  libro: any;
  selectedFile: File | null = null;

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

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.selectedFile = file;
      console.log('Archivo PDF seleccionado:', this.selectedFile?.name);
      this.libroForm.patchValue({ pdf: file });
      this.libroForm.get('pdf')?.markAsTouched();  // Marca el campo como tocado
    } else {
      console.error('Por favor, selecciona un archivo PDF válido.');
      this.selectedFile = null;
      this.libroForm.patchValue({ pdf: null });
      this.libroForm.get('pdf')?.markAsTouched();  // Marca el campo como tocado
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

  async takePicture() {
    const image2 = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt
    });
    this.libroForm.patchValue({ foto: image2.dataUrl });
  }

  async guardarCambios() {
    if (this.libroForm.valid) {
      const { titulo, sinopsis, foto, categoriaFK } = this.libroForm.value;
      const idPublicacion = this.libro.idPublicacion;
  
      try {
        let pdfUri = this.libro.pdf; // Por defecto, usa el PDF existente
  
        if (this.selectedFile) {
          // Si hay un archivo PDF nuevo seleccionado, guárdalo y obtén su URI
          pdfUri = await this.guardarArchivoPDF(this.selectedFile);
          console.log('Nuevo archivo PDF guardado en:', pdfUri);
        }
  
        // Actualiza la publicación en la base de datos con el nuevo PDF o el existente
        await this.db.actualizarPublicacion(
          titulo,
          sinopsis,
          foto,
          pdfUri, // Pasa la URI del PDF
          categoriaFK,
          idPublicacion
        );
  
        console.log('Cambios guardados correctamente');
  
        // Obtener la publicación actualizada desde la base de datos
        const libroActualizado = await this.db.obtenerPublicacionPorId(idPublicacion);
  
        if (libroActualizado) {
          // Navegar al detalle con los datos actualizados
          this.router.navigate(['/detalle-libro'], { state: { libro: libroActualizado } });
        } else {
          console.error('No se pudo obtener la publicación actualizada');
        }
      } catch (error) {
        console.error('Error al guardar los cambios:', error);
      }
    } else {
      console.error('El formulario no es válido:', this.libroForm.errors);
    }
  }
  
  
}
