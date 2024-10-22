import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerPdfPage } from './ver-pdf.page';

describe('VerPdfPage', () => {
  let component: VerPdfPage;
  let fixture: ComponentFixture<VerPdfPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VerPdfPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
