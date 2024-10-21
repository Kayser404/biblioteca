import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'registro-usuario',
    loadChildren: () => import('./pages/registro-usuario/registro-usuario.module').then( m => m.RegistroUsuarioPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'registrar-libro',
    loadChildren: () => import('./pages/registrar-libro/registrar-libro.module').then( m => m.RegistrarLibroPageModule)
  },  {
    path: 'lista-libro',
    loadChildren: () => import('./pages/lista-libro/lista-libro.module').then( m => m.ListaLibroPageModule)
  },
  {
    path: 'detalle-libro',
    loadChildren: () => import('./pages/detalle-libro/detalle-libro.module').then( m => m.DetalleLibroPageModule)
  },
  {
    path: 'editar-libro',
    loadChildren: () => import('./pages/editar-libro/editar-libro.module').then( m => m.EditarLibroPageModule)
  },
  {
    path: 'favorito',
    loadChildren: () => import('./pages/favorito/favorito.module').then( m => m.FavoritoPageModule)
  },
  {
    path: 'perfil',
    loadChildren: () => import('./pages/perfil/perfil.module').then( m => m.PerfilPageModule)
  },



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
