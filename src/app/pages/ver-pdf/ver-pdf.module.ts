import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerPdfPageRoutingModule } from './ver-pdf-routing.module';

import { VerPdfPage } from './ver-pdf.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerPdfPageRoutingModule
  ],
  declarations: [VerPdfPage]
})
export class VerPdfPageModule {}
