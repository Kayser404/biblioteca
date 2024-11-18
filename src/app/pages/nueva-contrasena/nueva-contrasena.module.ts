import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NuevaContrasenaPageRoutingModule } from './nueva-contrasena-routing.module';

import { NuevaContrasenaPage } from './nueva-contrasena.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NuevaContrasenaPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [NuevaContrasenaPage]
})
export class NuevaContrasenaPageModule {}
