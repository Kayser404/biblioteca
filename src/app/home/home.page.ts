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

  constructor(
    private db: DbService,
    private router: Router,
    private rest: ApiService
  ) {}

  ngOnInit() {
    this.db.dbState().subscribe((res) => {
      if (res) {
        this.db.fetchPublicaciones().subscribe((item) => {
          this.libros = item;
        });
      }
    });

    // Obtener un chiste aleatorio en español
    this.rest.getRandomJoke().subscribe(
      (data) => {
        console.log('Chiste obtenido:', data);  // Verifica los datos recibidos
        if (data.type === 'single') {
          this.joke = data.joke;  // Si el chiste es de una sola parte
        } else {
          this.joke = `${data.setup} - ${data.delivery}`;  // Si el chiste tiene pregunta y respuesta
        }
      },
      (error) => {
        console.error('Error al obtener el chiste:', error);
      }
    );
  }

  verDetalles(libro: any) {
    this.router.navigate(['/detalle-libro'], { state: { libro } });
  }
}
