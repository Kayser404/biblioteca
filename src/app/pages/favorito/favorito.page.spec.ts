import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FavoritoPage } from './favorito.page';
import { DbService } from '../../services/db.service';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';

describe('FavoritoPage', () => {
  let component: FavoritoPage;
  let fixture: ComponentFixture<FavoritoPage>;

  beforeEach(async () => {
    // Mock de SQLite
    const sqliteMock = {
      executeSql: jasmine.createSpy('executeSql').and.returnValue(Promise.resolve())
    };

    await TestBed.configureTestingModule({
      declarations: [FavoritoPage],
      providers: [
        { provide: SQLite, useValue: sqliteMock },  // Proveemos el mock de SQLite
        DbService  // Asegúrate de que tu DbService también esté proporcionado
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FavoritoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
