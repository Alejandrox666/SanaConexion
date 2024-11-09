import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpedientesComponent } from './expedientes.component';

describe('ExpedientesComponent', () => {
  let component: ExpedientesComponent;
  let fixture: ComponentFixture<ExpedientesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExpedientesComponent]
    });
    fixture = TestBed.createComponent(ExpedientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
