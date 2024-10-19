import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistrarLibroPage } from './registrar-libro.page';

const routes: Routes = [
  {
    path: '',
    component: RegistrarLibroPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistrarLibroPageRoutingModule {}
