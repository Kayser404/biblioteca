import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarLibroPage } from './editar-libro.page';
import { DbService } from '../../services/db.service';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { Router, Navigation, UrlTree } from '@angular/router';
import { of } from 'rxjs';

describe('EditarLibroPage', () => {
  let component: EditarLibroPage;
  let fixture: ComponentFixture<EditarLibroPage>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    // Mock de SQLite
    const sqliteMock = {
      executeSql: jasmine.createSpy('executeSql').and.returnValue(Promise.resolve({ rows: { length: 1, item: () => ({ fechaPublicacion: '2024-11-01' }) } }))
    };

    // Mock de DbService
    const dbServiceMock = {
      buscarPublicacion: jasmine.createSpy('buscarPublicacion').and.returnValue(of({ fechaPublicacion: '2024-11-01' })),
      dbState: jasmine.createSpy('dbState').and.returnValue(of(true))
    };

    // Mock de Router
    routerSpy = jasmine.createSpyObj('Router', ['getCurrentNavigation', 'createUrlTree']);

    // Simulando UrlTree
    const mockUrlTree = { toString: () => '/editar-libro' } as UrlTree;

    const navigationMock: Navigation = {
      id: 1,
      initialUrl: mockUrlTree,
      extractedUrl: mockUrlTree,
      trigger: 'imperative',
      previousNavigation: null,
      extras: {
        state: {
          libro: {
            idPublicacion: 1,
            fechaPublicacion: '2024-11-01',
            titulo: 'Libro de prueba',
            sinopsis: 'Una sinopsis de prueba',
            foto: 'foto.jpg',
            pdf: 'pdf.pdf',
            categoriaFK: 1
          }
        }
      }
    };

    // El router debería devolver el objeto navigationMock
    routerSpy.getCurrentNavigation.and.returnValue(navigationMock);
    routerSpy.createUrlTree.and.returnValue(mockUrlTree); // Mock del método createUrlTree

    await TestBed.configureTestingModule({
      declarations: [EditarLibroPage],
      providers: [
        { provide: SQLite, useValue: sqliteMock },
        { provide: DbService, useValue: dbServiceMock },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditarLibroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.libro).toBeDefined();
    expect(component.libro.fechaPublicacion).toBe('2024-11-01');
  });
});
