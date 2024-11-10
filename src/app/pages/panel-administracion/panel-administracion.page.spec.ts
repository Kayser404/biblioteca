import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PanelAdministracionPage } from './panel-administracion.page';

describe('PanelAdministracionPage', () => {
  let component: PanelAdministracionPage;
  let fixture: ComponentFixture<PanelAdministracionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelAdministracionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
