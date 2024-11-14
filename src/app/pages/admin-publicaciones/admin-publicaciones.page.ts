import { Component, OnInit } from '@angular/core';
import { DbService } from 'src/app/services/db.service';
import { Publicacion } from 'src/app/services/publicacion';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-publicaciones',
  templateUrl: './admin-publicaciones.page.html',
  styleUrls: ['./admin-publicaciones.page.scss'],
})
export class AdminPublicacionesPage implements OnInit {
  publicaciones: Publicacion[] = [];

  constructor(private db: DbService, private router: Router) {}

  ngOnInit() {
    this.db.fetchPublicaciones().subscribe((data) => {
      this.publicaciones = data;
    });
    this.db.buscarPublicacion(); // Inicializar la carga de publicaciones
  }

  // Ver detalles de la publicación
  verDetalleLibro(libro: any) {
    this.router.navigate(['/detalle-libro'], { state: { libro } });
  }

  
}
