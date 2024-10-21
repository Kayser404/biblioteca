import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  usuario: any;

  constructor(private auth: AuthService, private db: DbService) {}

  ngOnInit() {
    // Obtener el ID del usuario desde el AuthService o localStorage
    const idUsuario = this.auth.getIdUsuario();

    // Cargar los datos del usuario desde la base de datos
    if (idUsuario) {
      this.db
        .obtenerUsuarioPorId(idUsuario)
        .then((usuario) => {
          this.usuario = usuario;
          console.log('Datos del usuario cargados:', this.usuario);
        })
        .catch((error: any) => {
          console.error('Error al cargar los datos del usuario:', error);
        });
    }
  }
}
