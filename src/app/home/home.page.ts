import { Component, OnInit } from '@angular/core';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  libros: any[] = [];

  constructor(private db: DbService) {}

  ngOnInit() {
    this.db.dbState().subscribe((res) => {
      if (res) {
        this.db.fetchPublicaciones().subscribe((item) => {
          // Filtramos el arreglo para omitir el rol de admin
          this.libros = item;
          // Imprimir cada libro y sus campos
          this.libros.forEach((libro) => {
            console.log('ID Publicacion:', libro.idPublicacion);
            console.log('Título:', libro.titulo);
            console.log('Sinopsis:', libro.sinopsis);
            console.log('Fecha de Publicación:', libro.fechaPublicacion);
            console.log('Foto:', libro.foto);
            console.log('PDF:', libro.pdf);
            console.log('Usuario FK:', libro.usuarioFK);
            console.log('Categoría FK:', libro.categoriaFK);
          });
        });
      }
    });
  }

  verDetalles(libro: any) {
    console.log('Ver detalles de:', libro.titulo);
    // Aquí podrías navegar a una página de detalles del libro
  }
}
