import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PanelAdministracionPageRoutingModule } from './panel-administracion-routing.module';

import { PanelAdministracionPage } from './panel-administracion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PanelAdministracionPageRoutingModule
  ],
  declarations: [PanelAdministracionPage]
})
export class PanelAdministracionPageModule {}
