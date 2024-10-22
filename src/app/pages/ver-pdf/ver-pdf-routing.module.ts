import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerPdfPage } from './ver-pdf.page';

const routes: Routes = [
  {
    path: '',
    component: VerPdfPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerPdfPageRoutingModule {}
