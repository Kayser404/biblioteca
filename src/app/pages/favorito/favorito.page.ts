import { Component, OnInit } from '@angular/core';
import { DbService } from 'src/app/services/db.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-favorito',
  templateUrl: './favorito.page.html',
  styleUrls: ['./favorito.page.scss'],
})
export class FavoritoPage implements OnInit {
  publicacionesFavoritas: any[] = [];
  private favoritoSubscription: Subscription;
  idUsuario: string | null = null;

  constructor(
    private db: DbService, 
    private auth: AuthService, 
    private router: Router,
    private cd: ChangeDetectorRef
  ) {
    this.favoritoSubscription = new Subscription();
  }

  ngOnInit() {
    this.actualizarListadoFavorito();
    const idUsuario = this.auth.getIdUsuario();
    this.favoritoSubscription = this.db.fetchFavorito().subscribe(() => {
      this.actualizarListadoFavorito();
    });
  }

  ngOnDestroy() {
    this.favoritoSubscription.unsubscribe(); // Limpiar la suscripción
  }

  private async actualizarListadoFavorito() {
    // Obtener el ID del usuario desde AuthService o localStorage
    this.idUsuario = this.auth.getIdUsuario();
    
    // Cargar las publicaciones favoritas del usuario
    if (this.idUsuario) {
      this.db.obtenerFavoritoUsuario(this.idUsuario)
        .then(favoritos => {
          // Extraer los IDs de las publicaciones favoritas
          const idsPublicaciones = favoritos.map(fav => fav.idPublicacionFK);

          // Usar `Promise.all` para obtener todos los detalles de las publicaciones favoritas
          const promesasPublicaciones = idsPublicaciones.map(id => this.db.obtenerPublicacionPorId(id));
          return Promise.all(promesasPublicaciones);
        })
        .then(publicaciones => {
          // Filtrar cualquier resultado null (por si alguna publicación no fue encontrada)
          this.publicacionesFavoritas = publicaciones.filter(pub => pub !== null);
          console.log('Publicaciones favoritas cargadas:', this.publicacionesFavoritas);
        })
        .catch(error => {
          console.error('Error al cargar las publicaciones favoritas:', error);
        });
    }
    this.cd.detectChanges(); // Forzar la detección de cambios
  }

  // Método para ver el detalle de una publicación
  verDetalle(libro: any) {
    this.router.navigate(['/detalle-libro'], { state: { libro } });
  }
}
