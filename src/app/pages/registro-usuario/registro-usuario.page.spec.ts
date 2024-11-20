import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroUsuarioPage } from './registro-usuario.page';
import { DbService } from '../../services/db.service';  // Asegúrate de que la ruta de tu servicio DbService sea correcta
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';  // Importa SQLite

describe('RegistroUsuarioPage', () => {
  let component: RegistroUsuarioPage;
  let fixture: ComponentFixture<RegistroUsuarioPage>;

  beforeEach(async () => {
    // Mock de SQLite
    const sqliteMock = {
      executeSql: jasmine.createSpy('executeSql').and.returnValue(Promise.resolve())
    };

    await TestBed.configureTestingModule({
      declarations: [RegistroUsuarioPage],
      providers: [
        { provide: SQLite, useValue: sqliteMock },  // Proveemos el mock de SQLite
        DbService  // Asegúrate de que tu DbService también esté proporcionado
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroUsuarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
