import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistrarLibroPage } from './registrar-libro.page';

describe('RegistrarLibroPage', () => {
  let component: RegistrarLibroPage;
  let fixture: ComponentFixture<RegistrarLibroPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrarLibroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
