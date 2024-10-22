import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FileOpener } from '@capacitor-community/file-opener';

@Component({
  selector: 'app-ver-pdf',
  templateUrl: './ver-pdf.page.html',
  styleUrls: ['./ver-pdf.page.scss'],
})
export class VerPdfPage implements OnInit {
  pdfSrc: string | undefined;

  constructor(private router: Router) {}

  async ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state && navigation.extras.state['pdfSrc']) {
      const filePath = navigation.extras.state['pdfSrc'];
      console.log('Ruta recibida para el PDF:', filePath);

      try {
        await this.abrirPDF(filePath);
        console.log('PDF abierto correctamente.');
      } catch (error) {
        console.error('Error al abrir el archivo PDF:', error);
      }
    } else {
      console.error('No se encontró la URL del PDF en el estado de navegación.');
    }
  }

  // Método para abrir el PDF usando FileOpener
  async abrirPDF(filePath: string) {
    try {
      await FileOpener.open({
        filePath: filePath,
        contentType: 'application/pdf'
      });
    } catch (error) {
      console.error('Error al intentar abrir el PDF:', error);
    }
  }
}
