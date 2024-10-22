import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { DbService } from 'src/app/services/db.service';
import { FileOpener } from '@capacitor-community/file-opener';

@Component({
  selector: 'app-detalle-libro',
  templateUrl: './detalle-libro.page.html',
  styleUrls: ['./detalle-libro.page.scss'],
})
export class DetalleLibroPage implements OnInit {
  libro: any;
  idUsuario: string | null = null;
  esFavorito: boolean = false;

  constructor(
    private router: Router,
    private auth: AuthService,
    private db: DbService
  ) {}

  ngOnInit() {
    // Obtener el ID del usuario desde localStorage
    this.idUsuario = this.auth.getIdUsuario();
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
  
}