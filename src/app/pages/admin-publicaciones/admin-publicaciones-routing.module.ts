import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminPublicacionesPage } from './admin-publicaciones.page';

const routes: Routes = [
  {
    path: '',
    component: AdminPublicacionesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminPublicacionesPageRoutingModule {}
