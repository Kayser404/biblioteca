import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-detalle-libro',
  templateUrl: './detalle-libro.page.html',
  styleUrls: ['./detalle-libro.page.scss'],
})
export class DetalleLibroPage implements OnInit {
  libro: any;
  idUsuario: string | null = null;

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
  }

  // Redireccionar a editar libro del usuario que coincide con su id de publicacion
  editarLibro() {
    this.router.navigate(['/editar-libro'], { state: { libro: this.libro } });
  }

  // Método para agregar el libro a favoritos
  /* agregarAFavoritos() {
    if (this.idUsuario && this.libro.idPublicacion) {
      this.db.agregarAFavoritos(this.idUsuario, this.libro.idPublicacion).then(() => {
        console.log('Libro agregado a favoritos');
        // Puedes mostrar un mensaje de éxito aquí si lo deseas
      }).catch(error => {
        console.error('Error al agregar el libro a favoritos:', error);
      });
    }
  } */
  agregarAFavoritos() {
    // Verificar si el ID del usuario y el ID de la publicación están definidos
    if (this.idUsuario && this.libro.idPublicacion) {
      // Imprimir los IDs antes de realizar la inserción en la base de datos
      console.log('ID del Usuario:', this.idUsuario);
      console.log('ID de la Publicación:', this.libro.idPublicacion);

      // Llamar al método para agregar a favoritos
      this.db
        .agregarAFavoritos(this.idUsuario, this.libro.idPublicacion)
        .then(() => {
          console.log('Libro agregado a favoritos');
        })
        .catch((error) => {
          console.error('Error al agregar el libro a favoritos:', error);
        });
    } else {
      console.error('ID del Usuario o ID de la Publicación no están definidos');
    }
  }
}
