import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-detalle-libro',
  templateUrl: './detalle-libro.page.html',
  styleUrls: ['./detalle-libro.page.scss'],
})
export class DetalleLibroPage implements OnInit {
  libro: any;
  idUsuario: string | null = null;

  constructor(private router: Router, private auth: AuthService) {}

  ngOnInit() {
    // Obtener el ID del usuario desde localStorage
    this.idUsuario = this.auth.getIdUsuario();
    // Verificar que la navegación actual tenga el estado y que el objeto 'libro' exista
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state && navigation.extras.state['libro']) {
      this.libro = navigation.extras.state['libro'];
    } else {
      console.error('No se encontró el libro en el estado de navegación.');
    }
  }

  // Redireccionar a editar libro del usuario que coincide con su id de publicacion
  editarLibro() {
    this.router.navigate(['/editar-libro'], { state: { libro: this.libro } });
  }  
}
