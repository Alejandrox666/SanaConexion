import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormEspComponent } from './form-esp.component';

describe('FormEspComponent', () => {
  let component: FormEspComponent;
  let fixture: ComponentFixture<FormEspComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormEspComponent]
    });
    fixture = TestBed.createComponent(FormEspComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
