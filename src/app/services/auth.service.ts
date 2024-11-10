import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!localStorage.getItem('idUsuario');
  }

  // Obtener el ID del usuario
  getIdUsuario(): string | null {
    return localStorage.getItem('idUsuario');
  }

  // Almacenar roles del usuario
  setRolId(rolId: string): void {
    localStorage.setItem('rolId', rolId);
  }

  // Obtener el rol del usuario
  getRolId(): string | null {
    return localStorage.getItem('rolId');
  }

  // Verificar si el usuario es administrador
  isAdmin(): boolean {
    return this.getRolId() === '1';  // Asumiendo que el rol de administrador tiene id 1
  }

  // Cerrar sesión
  logout(): void {
    localStorage.removeItem('idUsuario');
    localStorage.removeItem('rolId');  // Asegurarse de eliminar el rol
  }
}
