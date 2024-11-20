import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NuevaContrasenaPage } from './nueva-contrasena.page';
import { ActivatedRoute } from '@angular/router';  // Importa ActivatedRoute
import { of } from 'rxjs';  // Usamos 'of' para crear un observable
import { DbService } from '../../services/db.service';  // Asegúrate de que la ruta sea correcta
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';  // Asegúrate de que la ruta sea correcta para SQLite

describe('NuevaContrasenaPage', () => {
  let component: NuevaContrasenaPage;
  let fixture: ComponentFixture<NuevaContrasenaPage>;

  beforeEach(() => {
    // Mock de ActivatedRoute con params
    const activatedRouteMock = {
      params: of({ idUsuario: 123 })  // Simulamos que el parámetro 'idUsuario' tiene un valor
    };

    // Mock de SQLite
    const sqliteMock = {
      executeSql: jasmine.createSpy('executeSql').and.returnValue(Promise.resolve())  // Mock del método executeSql
    };

    // Mock de DbService
    const dbServiceMock = {
      actualizarContrasena: jasmine.createSpy('actualizarContrasena').and.returnValue(of('Success')),  // Devuelve un observable con un valor de éxito
      dbState: jasmine.createSpy('dbState').and.returnValue(of(true)),  // Simula un observable con un valor booleano
    };

    TestBed.configureTestingModule({
      declarations: [NuevaContrasenaPage],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },  // Proveemos el mock de ActivatedRoute
        { provide: SQLite, useValue: sqliteMock },  // Proveemos el mock de SQLite
        { provide: DbService, useValue: dbServiceMock }  // Proveemos el elonmock de DbService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NuevaContrasenaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
