import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { personCircle, personCircleOutline, sunny, sunnyOutline } from 'ionicons/icons';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit{
  themeToggle = false;

  constructor(
    private menu: MenuController,
    private router: Router
  ) {
    addIcons({ personCircle, personCircleOutline, sunny, sunnyOutline });
  }

  // Método para alternar el menú
  toggleMenu() {
    this.menu.toggle('main-menu'); // 'main-menu' es el ID del menú
  }

  logout() {
    // Cierra el menú antes de redirigir o cerrar sesión
    this.menu.close();
    // Eliminar id del usuario del localstorage
    localStorage.removeItem('idUsuario');
    // Aquí va la lógica de cierre de sesión, como borrar tokens o navegar a la pantalla de login
    console.log('Cerrar sesión');
    this.router.navigate(['/login']); // Redirige a la página de login
  }
  // Método para navegar a diferentes rutas
  navigateTo(path: string) {
    this.router.navigate([`/${path}`]);
    this.menu.close(); // Cierra el menú después de la navegación
  }
  
  ngOnInit() {
    // Use matchMedia to check the user preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    // Initialize the dark theme based on the initial value of the prefers-color-scheme media query
    this.initializeDarkTheme(prefersDark.matches);

    // Listen for changes to the prefers-color-scheme media query
    prefersDark.addEventListener('change', (mediaQuery) => this.initializeDarkTheme(mediaQuery.matches));
  
  }

  // Check/uncheck the toggle and update the theme based on isDark
  initializeDarkTheme(isDark: boolean) {
    this.themeToggle = isDark;
    this.toggleDarkTheme(isDark);
  }

  // Listen for the toggle check/uncheck to toggle the dark theme
  toggleChange(ev: any) {
    this.toggleDarkTheme(ev.detail.checked);
  }

  // Add or remove the "dark" class on the document body
  toggleDarkTheme(shouldAdd: boolean) {
    document.body.classList.toggle('dark', shouldAdd);
  }
  
}
