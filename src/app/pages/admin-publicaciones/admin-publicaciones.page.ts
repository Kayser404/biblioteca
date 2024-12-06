import { Component, OnInit } from '@angular/core';
import { DbService } from 'src/app/services/db.service';
import { Publicacion } from 'src/app/services/publicacion';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-admin-publicaciones',
  templateUrl: './admin-publicaciones.page.html',
  styleUrls: ['./admin-publicaciones.page.scss'],
})
export class AdminPublicacionesPage implements OnInit {
  publicaciones: Publicacion[] = [];
  idUsuario: string | null = null;
  mensaje: string | null = null;

  constructor(private db: DbService, 
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.idUsuario = this.auth.getIdUsuario();

    // Obtener el mensaje de los parámetros de consulta
    this.route.queryParams.subscribe(async (params) => {
      if (params['mensaje']) {
        this.mensaje = params['mensaje'];
        await this.mostrarToast(this.mensaje ?? ''); // Usar '' si mensaje es null
      }
    });
    
    this.db.fetchPublicaciones().subscribe((data) => {
      this.publicaciones = data.filter((Publicacion) => Publicacion.estado !== 'aprobado' && this.idUsuario !== Publicacion.usuarioFK.toString());
    
    });
    this.db.buscarPublicacion(); // Inicializar la carga de publicaciones
  }

  // Ver detalles de la publicación
  verDetalleLibro(libro: any) {
    this.router.navigate(['/detalle-libro'], { state: { libro } });
  }

  // Método para mostrar un Toast
  async mostrarToast(mensaje: string) {
    const color = mensaje.includes('rechazada') ? 'danger' : 'success'; // Color según el mensaje
  
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000, // Duración del Toast en milisegundos
      position: 'top', // Posición del Toast
      color: color, // Color dinámico
    });
  
    await toast.present();
  }
  

}
