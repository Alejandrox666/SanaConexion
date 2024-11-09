import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuestionariosExpComponent } from './cuestionarios-exp.component';

describe('CuestionariosExpComponent', () => {
  let component: CuestionariosExpComponent;
  let fixture: ComponentFixture<CuestionariosExpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CuestionariosExpComponent]
    });
    fixture = TestBed.createComponent(CuestionariosExpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
