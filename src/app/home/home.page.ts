import { Component, OnInit } from '@angular/core';
import { DbService } from 'src/app/services/db.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  libros: any[] = [];

  constructor(
    private db: DbService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.db.dbState().subscribe((res) => {
      if (res) {
        this.db.fetchPublicaciones().subscribe((item) => {
          this.libros = item;
        });
      }
    });
  }

  verDetalles(libro: any) {
    this.router.navigate(['/detalle-libro'], { state: { libro } });
  }
}
