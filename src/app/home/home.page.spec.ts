import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { HomePage } from './home.page';
import { DbService } from '../services/db.service';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { HttpClientModule } from '@angular/common/http';  // Importa HttpClientModule

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(async () => {
    // Mock de SQLite
    const sqliteMock = {
      executeSql: jasmine.createSpy('executeSql').and.returnValue(Promise.resolve())
    };

    await TestBed.configureTestingModule({
      declarations: [HomePage],
      imports: [
        IonicModule.forRoot(),
        HttpClientModule  // Asegúrate de importar HttpClientModule
      ],
      providers: [
        { provide: SQLite, useValue: sqliteMock },  // Proveemos el mock de SQLite
        DbService  // Asegúrate de que tu DbService también esté proporcionado
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería obtener un chiste y asignarlo correctamente', () => {
    const jokeMock = { type: 'single', joke: '¡Este es un chiste de prueba!' };
    const restSpy = spyOn(component['rest'], 'getRandomJoke').and.returnValue({
      subscribe: (success: (data: any) => void) => success(jokeMock),
    } as any);
  
    component.ngOnInit();
  
    expect(restSpy).toHaveBeenCalled(); // Asegura que se llama a getRandomJoke
    expect(component.joke).toBe(jokeMock.joke); // Verifica que el chiste se asigna correctamente
  });
  
  it('debería navegar a la página de detalles con el libro proporcionado', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    const libroMock = { id: 1, titulo: 'Libro de prueba' };
  
    component.verDetalles(libroMock);
  
    expect(routerSpy).toHaveBeenCalledWith(['/detalle-libro'], { state: { libro: libroMock } });
  });
  
});
