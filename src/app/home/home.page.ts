import { Component, OnInit } from '@angular/core';
import { DbService } from 'src/app/services/db.service';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  libros: any[] = [];
  joke: string = '';
  loadingBooks: boolean = true; // Estado para libros
  loadingJoke: boolean = true; // Estado para el chiste

  constructor(
    private db: DbService,
    private router: Router,
    private rest: ApiService
  ) {}

  ngOnInit() {
    this.loadBooks();
    this.loadJoke();
  }

  loadBooks() {
    this.db.dbState().subscribe((res) => {
      if (res) {
        this.db.fetchPublicaciones().subscribe((items) => {
          this.libros = items.filter((libro) => libro.estado === 'aprobado');;
    
        });
      }
    });
  }

  loadJoke() {
    this.rest.getRandomJoke().subscribe(
      (data) => {
        if (data.type === 'single') {
          this.joke = data.joke;
        } else {
          this.joke = `${data.setup} - ${data.delivery}`;
        }
        this.loadingJoke = false; // El chiste se ha cargado
      },
      (error) => {
        console.error('Error al obtener el chiste:', error);
        this.loadingJoke = false; // Termina el estado de carga incluso con error
      }
    );
  }

  refreshJoke() {
    this.loadingJoke = true;
    this.loadJoke();
  }

  verDetalles(libro: any) {
    this.router.navigate(['/detalle-libro'], { state: { libro } });
  }
}
