import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListaLibroPage } from './lista-libro.page';

const routes: Routes = [
  {
    path: '',
    component: ListaLibroPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListaLibroPageRoutingModule {}
