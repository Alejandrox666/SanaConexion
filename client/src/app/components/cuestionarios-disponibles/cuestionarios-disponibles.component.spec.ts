import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuestionariosDisponiblesComponent } from './cuestionarios-disponibles.component';

describe('CuestionariosDisponiblesComponent', () => {
  let component: CuestionariosDisponiblesComponent;
  let fixture: ComponentFixture<CuestionariosDisponiblesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CuestionariosDisponiblesComponent]
    });
    fixture = TestBed.createComponent(CuestionariosDisponiblesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
