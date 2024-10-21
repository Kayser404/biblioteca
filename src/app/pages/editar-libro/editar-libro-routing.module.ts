import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditarLibroPage } from './editar-libro.page';

const routes: Routes = [
  {
    path: '',
    component: EditarLibroPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditarLibroPageRoutingModule {}
