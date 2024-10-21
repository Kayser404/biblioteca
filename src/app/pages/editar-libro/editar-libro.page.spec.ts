import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarLibroPage } from './editar-libro.page';

describe('EditarLibroPage', () => {
  let component: EditarLibroPage;
  let fixture: ComponentFixture<EditarLibroPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarLibroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
