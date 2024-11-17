import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { DbService } from 'src/app/services/db.service';
import { FileOpener } from '@capacitor-community/file-opener';
import { Publicacion } from 'src/app/services/publicacion';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-detalle-libro',
  templateUrl: './detalle-libro.page.html',
  styleUrls: ['./detalle-libro.page.scss'],
})
export class DetalleLibroPage implements OnInit {
  libro: any;
  idUsuario: string | null = null;
  isAdmin: boolean = false;
  esFavorito: boolean = false;
  observacionForm: FormGroup;
  comentarios: any[] = []; 
  comentarioForm: FormGroup; 


  constructor(
    private router: Router,
    private fb: FormBuilder,
    private auth: AuthService,
    private db: DbService
  ) {
    this.observacionForm = this.fb.group({
      observacion: ['', Validators.required],
    });
    this.comentarioForm = this.fb.group({
      texto: ['', Validators.required],
      puntuacion: ['', Validators.required],
    });
  }

  ngOnInit() {
    // Obtener el ID del usuario y rol desde localStorage
    this.idUsuario = this.auth.getIdUsuario();
    this.isAdmin = this.auth.isAdmin();

    // Verificar que la navegación actual tenga el estado y que el objeto 'libro' exista
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state && navigation.extras.state['libro']) {
      this.libro = navigation.extras.state['libro'];
    } else {
      console.error('No se encontró el libro en el estado de navegación.');
    }
    
    // Verificar si el libro ya está en favoritos
    if (this.idUsuario && this.libro?.idPublicacion) {
      this.db.obtenerFavoritoUsuario(this.idUsuario).then(favoritos => {
        this.esFavorito = favoritos.some(fav => fav.idPublicacionFK === this.libro.idPublicacion);
      });
    }

    this.db.obtenerComentarios(this.libro.idPublicacion).then((comentarios) => {
      this.comentarios = comentarios;
      console.log('Comentarios con puntuación:', this.comentarios);
    });
    
  }

  // Método para agregar el comentario
  agregarComentario() {
    if (this.comentarioForm.valid) {
      const nuevoComentario = this.comentarioForm.value;
      
      this.db
        .agregarComentario(
          this.libro.idPublicacion,
          this.idUsuario,
          nuevoComentario.texto,
          nuevoComentario.rating
        )
        .then(() => {
          console.log('Comentario y puntuación agregados correctamente.');
          this.comentarioForm.reset(); // Reiniciar el formulario después de enviar
        })
        .catch((error) => {
          console.error('Error al agregar el comentario:', error);
        });
    }
  }

  // Método para abrir el PDF usando FileOpener
  async verPDF() {
    if (this.libro?.pdf) {
      try {
        await FileOpener.open({
          filePath: this.libro.pdf,
          contentType: 'application/pdf'
        });
        console.log('PDF abierto correctamente.');
      } catch (error) {
        console.error('Error al abrir el archivo PDF:', error);
      }
    } else {
      console.error('No se encontró la URI del PDF.');
    }
  }

  // Redireccionar a editar libro del usuario que coincide con su id de publicacion
  editarLibro() {
    this.router.navigate(['/editar-libro'], { state: { libro: this.libro } });
  }

  // Eliminar una publicación
  async eliminarPublicacion(publicacion: Publicacion) {
    await this.db.eliminarPublicacionPorId(Number(publicacion.idPublicacion));
    this.db.buscarPublicacion(); // Refrescar la lista
  }

   // Método para alternar entre agregar y eliminar de favoritos
   toggleFavorito() {
    if (this.esFavorito) {
      // Si ya es favorito, eliminar de favoritos
      this.quitarDeFavoritos();
    } else {
      // Si no es favorito, agregar a favoritos
      this.agregarAFavoritos();
    }
  }

  agregarAFavoritos() {
    if (this.idUsuario && this.libro.idPublicacion) {
      this.db
        .agregarAFavoritos(this.idUsuario, this.libro.idPublicacion)
        .then(() => {
          console.log('Libro agregado a favoritos');
          this.esFavorito = true; // Actualizar el estado a "favorito"
        })
        .catch((error) => {
          console.error('Error al agregar el libro a favoritos:', error);
        });
    } else {
      console.error('ID del Usuario o ID de la Publicación no están definidos');
    }
  }

  quitarDeFavoritos() {
    if (this.idUsuario && this.libro.idPublicacion) {
      this.db
        .quitarDeFavoritos(this.idUsuario, this.libro.idPublicacion)
        .then(() => {
          console.log('Libro eliminado de favoritos');
          this.esFavorito = false; // Actualizar el estado a "no favorito"
        })
        .catch((error) => {
          console.error('Error al eliminar el libro de favoritos:', error);
        });
    }
  }
  
  // Aprobar una publicación
  async aprobarPublicacion(publicacion: Publicacion) {
    const observacion = this.observacionForm.value.observacion

    await this.db.aprobarRechazarPublicacionPorId(
      Number(publicacion.idPublicacion),
      'aprobado',
      observacion
    );
    this.db.buscarPublicacion(); // Refrescar la lista
  }

  // Rechazar una publicación
  async rechazarPublicacion(publicacion: Publicacion) {
    const observacion = this.observacionForm.value.observacion

    await this.db.aprobarRechazarPublicacionPorId(
      Number(publicacion.idPublicacion),
      'rechazado',
      observacion
    );
    this.db.buscarPublicacion(); // Refrescar la lista
  }
  
}