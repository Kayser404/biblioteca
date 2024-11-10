import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PanelAdministracionPage } from './panel-administracion.page';

const routes: Routes = [
  {
    path: '',
    component: PanelAdministracionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PanelAdministracionPageRoutingModule {}
