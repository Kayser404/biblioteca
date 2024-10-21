import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListaLibroPage } from './lista-libro.page';

describe('ListaLibroPage', () => {
  let component: ListaLibroPage;
  let fixture: ComponentFixture<ListaLibroPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaLibroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
