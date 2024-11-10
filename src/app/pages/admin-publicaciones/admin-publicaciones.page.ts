import { Component, OnInit } from '@angular/core';
import { DbService } from 'src/app/services/db.service';
import { Publicacion } from 'src/app/services/publicacion';

@Component({
  selector: 'app-admin-publicaciones',
  templateUrl: './admin-publicaciones.page.html',
  styleUrls: ['./admin-publicaciones.page.scss'],
})
export class AdminPublicacionesPage implements OnInit {
  publicaciones: Publicacion[] = [];

  constructor(private db: DbService) {}

  ngOnInit() {
    this.db.fetchPublicaciones().subscribe((data) => {
      this.publicaciones = data;
    });
    this.db.buscarPublicacion(); // Inicializar la carga de publicaciones
  }

  // Ver detalles de la publicación
  verDetalles(publicacion: Publicacion) {
    console.log('Detalles de publicación:', publicacion);
  }

  // Aprobar una publicación
  async aprobarPublicacion(publicacion: Publicacion) {
    await this.db.aprobarRechazarPublicacionPorId(
      Number(publicacion.idPublicacion),
      'aprobado'
    );
    this.db.buscarPublicacion(); // Refrescar la lista
  }

  // Rechazar una publicación
  async rechazarPublicacion(publicacion: Publicacion) {
    await this.db.aprobarRechazarPublicacionPorId(
      Number(publicacion.idPublicacion),
      'rechazado'
    );
    this.db.buscarPublicacion(); // Refrescar la lista
  }

  // Eliminar una publicación
  async eliminarPublicacion(publicacion: Publicacion) {
    await this.db.eliminarPublicacionPorId(Number(publicacion.idPublicacion));
    this.db.buscarPublicacion(); // Refrescar la lista
  }
}
