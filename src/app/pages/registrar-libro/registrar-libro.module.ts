import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistrarLibroPageRoutingModule } from './registrar-libro-routing.module';

import { RegistrarLibroPage } from './registrar-libro.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RegistrarLibroPageRoutingModule
  ],
  declarations: [RegistrarLibroPage]
})
export class RegistrarLibroPageModule {}
