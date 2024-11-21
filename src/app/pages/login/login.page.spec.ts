import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginPage } from './login.page';
import { DbService } from '../../services/db.service';  // Asegúrate de que la ruta del servicio DbService sea correcta
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';  // Importa SQLite

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;

  beforeEach(async () => {
    // Mock de SQLite
    const sqliteMock = {
      executeSql: jasmine.createSpy('executeSql').and.returnValue(Promise.resolve())
    };

    await TestBed.configureTestingModule({
      declarations: [LoginPage],
      providers: [
        { provide: SQLite, useValue: sqliteMock },  // Proveemos el mock de SQLite
        DbService  // Asegúrate de que tu DbService también esté proporcionado
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('Debe validar el campo de correo electronico como obligatorio', () => {
    const emailControl = component.loginForm.controls['email'];
    emailControl.setValue('');
    expect(emailControl.valid).toBeFalsy();
    expect(emailControl.hasError('required')).toBeTruthy();
  });
  
  it('Debe validar el formato del correo electrónico', () => {
    const emailControl = component.loginForm.controls['email'];
    emailControl.setValue('invalid-email'); // Valor incorrecto
    expect(emailControl.valid).toBeFalsy(); // Verifica que sea inválido
    expect(emailControl.hasError('email')).toBeTruthy(); // Verifica que el error sea de tipo 'email'
  });
  
  
  it('Debe validar el campo de contraseña como requerido', () => {
    const passwordControl = component.loginForm.controls['password'];
    passwordControl.setValue('');
    expect(passwordControl.valid).toBeFalsy();
    expect(passwordControl.hasError('required')).toBeTruthy();
  });
  


});
