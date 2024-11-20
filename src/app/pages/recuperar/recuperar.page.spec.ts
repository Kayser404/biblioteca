import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecuperarPage } from './recuperar.page';
import { DbService } from '../../services/db.service';  // Asegúrate de que la ruta de tu servicio DbService sea correcta
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx'; // Importa SQLite
import { IonicModule, ModalController } from '@ionic/angular'; // Importa ModalController y IonicModule

describe('RecuperarPage', () => {
  let component: RecuperarPage;
  let fixture: ComponentFixture<RecuperarPage>;

  beforeEach(async () => {
    // Mock de SQLite
    const sqliteMock = {
      executeSql: jasmine.createSpy('executeSql').and.returnValue(Promise.resolve())
    };

    // Mock de ModalController (si no necesitas usar funciones específicas de ModalController en las pruebas)
    const modalControllerMock = {
      create: jasmine.createSpy('create').and.returnValue(Promise.resolve())
    };

    await TestBed.configureTestingModule({
      declarations: [RecuperarPage],
      imports: [IonicModule.forRoot()], // Importa IonicModule
      providers: [
        { provide: SQLite, useValue: sqliteMock },  // Proveemos el mock de SQLite
        { provide: ModalController, useValue: modalControllerMock }, // Proveemos el mock de ModalController
        DbService  // Asegúrate de que tu DbService también esté proporcionado
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RecuperarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
