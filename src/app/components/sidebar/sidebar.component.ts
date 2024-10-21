import { Component, OnInit } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit{
  constructor(
    private menu: MenuController,
    private navCtrl: NavController,
    private router: Router
  ) {}

  // Método para alternar el menú
  toggleMenu() {
    this.menu.toggle('main-menu'); // 'main-menu' es el ID del menú
  }

  logout() {
    // Cierra el menú antes de redirigir o cerrar sesión
    this.menu.close();
    // Aquí va la lógica de cierre de sesión, como borrar tokens o navegar a la pantalla de login
    console.log('Cerrar sesión');
    this.navCtrl.navigateRoot('/login'); // Redirige a la página de login
  }
  listaLibros(){
    this.router.navigate(['/lista-libro'])
  }
  
  ngOnInit() {}
  
}
