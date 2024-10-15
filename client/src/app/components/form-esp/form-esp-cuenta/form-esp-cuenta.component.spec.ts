import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormEspCuentaComponent } from './form-esp-cuenta.component';

describe('FormEspCuentaComponent', () => {
  let component: FormEspCuentaComponent;
  let fixture: ComponentFixture<FormEspCuentaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormEspCuentaComponent]
    });
    fixture = TestBed.createComponent(FormEspCuentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
