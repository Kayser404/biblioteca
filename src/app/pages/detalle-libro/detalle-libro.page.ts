import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { DbService } from 'src/app/services/db.service';
import { FileOpener } from '@capacitor-community/file-opener';
import { Publicacion } from 'src/app/services/publicacion';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-detalle-libro',
  templateUrl: './detalle-libro.page.html',
  styleUrls: ['./detalle-libro.page.scss'],
})
export class DetalleLibroPage implements OnInit, OnDestroy {
  libro: any = {
    nombreAutor: '',
    apellidoAutor: '',
    sinopsis: '',
    fechaPublicacion: '',
    foto: '',
    pdf: '',
    categoriaFK: '',
    usuarioFK: null,
    observacion: '',
    estado: '',
  };

  idUsuario: string | null = null;
  isAdmin: boolean = false;
  esFavorito: boolean = false;
  observacionForm: FormGroup;
  comentarios: any[] = []; 
  comentarioForm: FormGroup; 
  navigationSubscription: Subscription = new Subscription();

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
      rating: ['', Validators.required],
    });
  }

  ngOnInit() {
  // Inicializar usuario y rol
  this.idUsuario = this.auth.getIdUsuario();
  this.isAdmin = this.auth.isAdmin();

  // Escuchar cambios en la navegación
  this.navigationSubscription = this.router.events.subscribe((event) => {
    if (event instanceof NavigationEnd && this.router.url.includes('/detalle-libro')) {
      console.log('NavigationEnd ejecutado, recargando datos.');
      this.cargarDatos();
    }
  });
}

ngOnDestroy() {
  // Limpiar la suscripción para evitar fugas de memoria
  if (this.navigationSubscription) {
    this.navigationSubscription.unsubscribe();
  }
}

cargarDatos() {
  const navigation = this.router.getCurrentNavigation();
  if (navigation?.extras?.state && navigation.extras.state['libro']) {
    this.libro = navigation.extras.state['libro'];

    // Verificar favoritos
    if (this.idUsuario && this.libro?.idPublicacion) {
      this.db.obtenerFavoritoUsuario(this.idUsuario).then((favoritos) => {
        this.esFavorito = favoritos.some(
          (fav) => fav.idPublicacionFK === this.libro.idPublicacion
        );
      });

      // Obtener comentarios
      this.db.obtenerComentarios(this.libro.idPublicacion).then((comentarios) => {
        this.comentarios = comentarios;
      });
    }
  } else {
    console.error('No se recibió ningún libro en la navegación.');
    this.libro = null; // Manejar el caso en que no se reciben datos
  }
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
          // Obtener los comentarios actualizados
          this.db.obtenerComentarios(this.libro.idPublicacion).then((comentarios) => {
            this.comentarios = comentarios;
            console.log('Comentarios actualizados:', this.comentarios);
          });
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
  editarLibro(libro: any) {
    this.router.navigate(['/editar-libro'], { state: { libro } });
  }

  // Eliminar una publicación
  async eliminarPublicacion(publicacion: Publicacion) {
    await this.db.eliminarPublicacionPorId(Number(publicacion.idPublicacion));
    this.db.buscarPublicacion(); // Refrescar la lista
    this.router.navigate(['/lista-libro']);
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
    // Navegar con un mensaje como parámetro
    this.router.navigate(['/admin-publicaciones'], {
      queryParams: { mensaje: 'Publicación aprobada exitosamente' }
    });
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
    // Navegar con un mensaje de rechazo
    this.router.navigate(['/admin-publicaciones'], {
      queryParams: { mensaje: 'Publicación rechazada exitosamente' }
    });
  }
  
}