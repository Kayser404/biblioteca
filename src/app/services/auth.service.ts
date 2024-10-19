import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  // Método para verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!localStorage.getItem('idUsuario');
  }

  // Método para obtener el ID del usuario
  getIdUsuario(): string | null {
    return localStorage.getItem('idUsuario');
  }

  // Método para almacenar roles del usuario (aunque ya lo haces fuera del servicio)
  setRoles(roles: any[]): void {
    localStorage.setItem('roles', JSON.stringify(roles));
  }

  // Método para obtener los roles del usuario
  getRoles(): any[] {
    const roles = localStorage.getItem('roles');
    return roles ? JSON.parse(roles) : [];
  }

  // Método para cerrar sesión
  logout(): void {
    localStorage.removeItem('idUsuario');
    localStorage.removeItem('roles');  // Asegurarse de eliminar los roles
  }
}
