import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detalle-libro',
  templateUrl: './detalle-libro.page.html',
  styleUrls: ['./detalle-libro.page.scss'],
})
export class DetalleLibroPage implements OnInit {
  libro: any;

  constructor(private router: Router) {}

  ngOnInit() {
    // Verificar que la navegación actual tenga el estado y que el objeto 'libro' exista
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state && navigation.extras.state['libro']) {
      this.libro = navigation.extras.state['libro'];
    } else {
      console.error('No se encontró el libro en el estado de navegación.');
      
    }
  }
}
