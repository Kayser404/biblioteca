import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetalleLibroPageRoutingModule } from './detalle-libro-routing.module';

import { DetalleLibroPage } from './detalle-libro.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    DetalleLibroPageRoutingModule
  ],
  declarations: [DetalleLibroPage]
})
export class DetalleLibroPageModule {}
