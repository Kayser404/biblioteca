import { TestBed } from '@angular/core/testing';
import { DbService } from './db.service';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';

describe('DbService', () => {
  let service: DbService;

  beforeEach(() => {
    // Mock de SQLite
    const sqliteMock = {
      executeSql: jasmine.createSpy('executeSql').and.returnValue(Promise.resolve())
    };

    TestBed.configureTestingModule({
      providers: [
        DbService,  // Asegúrate de que tu DbService esté proporcionado
        { provide: SQLite, useValue: sqliteMock }  // Proveemos el mock de SQLite
      ]
    });

    service = TestBed.inject(DbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
