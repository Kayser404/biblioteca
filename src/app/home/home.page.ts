import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  libros = [
    {
      titulo: 'El Principito',
      autor: 'Antoine de Saint-Exupéry',
      descripcion: 'Un pequeño príncipe explora planetas y aprende sobre la vida y el amor.',
      imagen: 'assets/img/el-principito.jpg'
    },
    {
      titulo: 'Cien Años de Soledad',
      autor: 'Gabriel García Márquez',
      descripcion: 'La historia épica de la familia Buendía en el pueblo ficticio de Macondo.',
      imagen: 'assets/img/cien-anos-de-soledad.jpg'
    },
    {
      titulo: '1984',
      autor: 'George Orwell',
      descripcion: 'Una distopía sobre un futuro controlado por un régimen totalitario.',
      imagen: 'assets/img/1984.jpg'
    }
    // Agrega más libros según sea necesario
  ];

  constructor() { }

  ngOnInit() {}

  verDetalles(libro: any) {
    console.log('Ver detalles de:', libro.titulo);
    // Aquí podrías navegar a una página de detalles del libro
  }
}
