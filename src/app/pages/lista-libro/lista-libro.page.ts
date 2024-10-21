import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { DbService } from 'src/app/services/db.service';
import { ChangeDetectorRef } from '@angular/core'; // Importar ChangeDetectorRef

@Component({
  selector: 'app-lista-libro',
  templateUrl: './lista-libro.page.html',
  styleUrls: ['./lista-libro.page.scss'],
})
export class ListaLibroPage implements OnInit, OnDestroy {
  publicaciones: any[] = [];
  private libroSubscription: Subscription;

  categorias: any[] = [];

  constructor(
    private router: Router,
    private db: DbService,
    private auth: AuthService,
    private cd: ChangeDetectorRef // Inyectar ChangeDetectorRef
  ) {
    this.libroSubscription = new Subscription();
  }

  ngOnInit() {
    this.actualizarListadoPublicacion();
    const idUsuario = this.auth.getIdUsuario();
    this.libroSubscription = this.db.fetchPublicaciones().subscribe(() => {
      this.actualizarListadoPublicacion();
    });
  }

  ngOnDestroy() {
    this.libroSubscription.unsubscribe(); // Limpiar la suscripción
  }

  // Función para mantener actualizado el listado de libros
  private async actualizarListadoPublicacion() {
    const idUsuario = this.auth.getIdUsuario();
    const publicaciones = await this.db.obtenerPublicacionUsuario(idUsuario);
    // Imprime el ID del usuario y las publicaciones obtenidas
    console.log('ID Usuario:', idUsuario);
    console.log('Publicaciones obtenidas:', publicaciones);
    this.publicaciones = publicaciones || []; // Asignar un array vacío si es null
    this.cd.detectChanges(); // Forzar la detección de cambios
  }

  verDetalleLibro(libro: any) {
    this.router.navigate(['/detalle-libro'], { state: { libro } });
  }
}
