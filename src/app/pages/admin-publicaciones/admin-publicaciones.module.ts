import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminPublicacionesPageRoutingModule } from './admin-publicaciones-routing.module';

import { AdminPublicacionesPage } from './admin-publicaciones.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminPublicacionesPageRoutingModule
  ],
  declarations: [AdminPublicacionesPage]
})
export class AdminPublicacionesPageModule {}
