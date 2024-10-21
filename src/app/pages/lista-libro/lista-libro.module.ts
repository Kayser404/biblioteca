import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListaLibroPageRoutingModule } from './lista-libro-routing.module';

import { ListaLibroPage } from './lista-libro.page';
import { SharedModule } from '../../components/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListaLibroPageRoutingModule,
    SharedModule,
  ],
  declarations: [ListaLibroPage]
})
export class ListaLibroPageModule {}
