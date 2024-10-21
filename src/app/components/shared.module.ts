import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [SidebarComponent], // Declaramos SidebarComponent aquí
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ],
  exports: [SidebarComponent] // Lo exportamos para que esté disponible en otros módulos
})
export class SharedModule {}
