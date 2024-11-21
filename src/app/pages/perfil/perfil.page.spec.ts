import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PerfilPage } from './perfil.page';
import { DbService } from '../../services/db.service';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';

describe('PerfilPage', () => {
  let component: PerfilPage;
  let fixture: ComponentFixture<PerfilPage>;

  beforeEach(async () => {
    // Mock de SQLite
    const sqliteMock = {
      executeSql: jasmine.createSpy('executeSql').and.returnValue(Promise.resolve())
    };

    await TestBed.configureTestingModule({
      declarations: [PerfilPage],
      providers: [
        { provide: SQLite, useValue: sqliteMock },  // Proveemos el mock de SQLite
        DbService  // Asegúrate de que tu DbService también esté proporcionado
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PerfilPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería activar y desactivar el modo de edición correctamente', () => {
    // Simular usuario y datos originales
    component.usuarioOriginal = { nombreUsuario: 'Original' };
    component.usuarioForm.patchValue({ nombreUsuario: 'Modificado' });
  
    // Activar el modo de edición
    component.editMode = false;
    component.toggleEditMode();
    expect(component.editMode).toBeTrue();
  
    // Desactivar el modo de edición y restaurar valores originales
    component.toggleEditMode();
    expect(component.editMode).toBeFalse();
    expect(component.usuarioForm.value.nombreUsuario).toBe('Original');
  });
  
  it('debería manejar correctamente el modo de edición si no hay usuario cargado', () => {
    component.usuarioOriginal = null;
    component.usuarioForm.patchValue({ nombreUsuario: 'Modificado' });
  
    component.editMode = false;
    component.toggleEditMode();
  
    expect(component.editMode).toBeTrue();
    expect(() => component.toggleEditMode()).not.toThrow();
  });
  
  
});
