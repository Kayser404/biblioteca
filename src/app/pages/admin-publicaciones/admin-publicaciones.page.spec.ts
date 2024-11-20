import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminPublicacionesPage } from './admin-publicaciones.page';
import { DbService } from '../../services/db.service';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';  // Asegúrate de importar SQLite
import { of } from 'rxjs';

describe('AdminPublicacionesPage', () => {
  let component: AdminPublicacionesPage;
  let fixture: ComponentFixture<AdminPublicacionesPage>;

  beforeEach(async () => {
    // Mock de SQLite
    const sqliteMock = {
      executeSql: jasmine.createSpy('executeSql').and.returnValue(Promise.resolve({ rows: { length: 0, item: () => {} } })) // Simula el resultado de executeSql
    };

    // Mock de DbService
    const dbServiceMock = {
      fetchPublicaciones: jasmine.createSpy('fetchPublicaciones').and.returnValue(of([])), // Simula el observable de fetchPublicaciones
      buscarPublicacion: jasmine.createSpy('buscarPublicacion').and.returnValue(of([])), // Simula el observable de buscarPublicacion
      dbState: jasmine.createSpy('dbState').and.returnValue(of(true))  // Simula un observable con valor 'true'
    };

    await TestBed.configureTestingModule({
      declarations: [AdminPublicacionesPage],
      providers: [
        { provide: SQLite, useValue: sqliteMock },  // Proveemos el mock de SQLite
        { provide: DbService, useValue: dbServiceMock }  // Proveemos el mock de DbService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminPublicacionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
