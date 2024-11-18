import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecuperarPageRoutingModule } from './recuperar-routing.module';
import {MatProgressBarModule} from '@angular/material/progress-bar';

import { RecuperarPage } from './recuperar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RecuperarPageRoutingModule,
    MatProgressBarModule
  ],
  declarations: [RecuperarPage]
})
export class RecuperarPageModule {}
