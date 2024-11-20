import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalleLibroPage } from './detalle-libro.page';
import { DbService } from '../../services/db.service';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';

describe('DetalleLibroPage', () => {
  let component: DetalleLibroPage;
  let fixture: ComponentFixture<DetalleLibroPage>;

  beforeEach(() => {
    // Mock de SQLite
    const sqliteMock = {
      executeSql: jasmine.createSpy('executeSql').and.returnValue(Promise.resolve())
    };

    TestBed.configureTestingModule({
      declarations: [DetalleLibroPage],
      providers: [
        { provide: SQLite, useValue: sqliteMock },  // Proveer el mock de SQLite
        DbService  // Asegúrate de que tu DbService también esté proporcionado
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DetalleLibroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
