import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-lista-libro',
  templateUrl: './lista-libro.page.html',
  styleUrls: ['./lista-libro.page.scss'],
})
export class ListaLibroPage implements OnInit {

  publicaciones: any[] = [];

  constructor(private router: Router, private db: DbService, private auth: AuthService) { }

  ngOnInit() {
    const idUsuario = this.auth.getIdUsuario();
    this.db.obtenerPublicacionUsuario(idUsuario).then((publicaciones) => {
      if (publicaciones) {
        this.publicaciones = publicaciones;
      } else {
        this.publicaciones = [];  // Asignar un array vacío en caso de que sea null
      }
    });
  }

  verDetalleLibro(libro: any) {
    this.router.navigate(['/detalle-libro'], { state: { libro } });
  }

}
