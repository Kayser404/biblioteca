import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListaLibroPage } from './lista-libro.page';
import { DbService } from '../../services/db.service';  // Asegúrate de que la ruta del servicio DbService sea correcta
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';  // Importa SQLite
import { of } from 'rxjs';  // Si necesitas devolver algo como un observable

describe('ListaLibroPage', () => {
  let component: ListaLibroPage;
  let fixture: ComponentFixture<ListaLibroPage>;

  beforeEach(async () => {
    // Mock de SQLite
    const sqliteMock = {
      executeSql: jasmine.createSpy('executeSql').and.returnValue(Promise.resolve())
    };

    await TestBed.configureTestingModule({
      declarations: [ListaLibroPage],
      providers: [
        { provide: SQLite, useValue: sqliteMock },  // Proveemos el mock de SQLite
        DbService  // Asegúrate de que tu DbService también esté proporcionado
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListaLibroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
