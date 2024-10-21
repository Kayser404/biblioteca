import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit{
  constructor(
    private menu: MenuController,
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
    this.router.navigate(['/login']); // Redirige a la página de login
  }
  // Método para navegar a diferentes rutas
  navigateTo(path: string) {
    this.router.navigate([`/${path}`]);
    this.menu.close(); // Cierra el menú después de la navegación
  }
  
  ngOnInit() {}
  
}
