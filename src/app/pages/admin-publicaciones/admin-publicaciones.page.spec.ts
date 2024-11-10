import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminPublicacionesPage } from './admin-publicaciones.page';

describe('AdminPublicacionesPage', () => {
  let component: AdminPublicacionesPage;
  let fixture: ComponentFixture<AdminPublicacionesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPublicacionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
