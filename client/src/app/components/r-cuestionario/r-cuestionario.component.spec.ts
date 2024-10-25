import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RCuestionarioComponent } from './r-cuestionario.component';

describe('RCuestionarioComponent', () => {
  let component: RCuestionarioComponent;
  let fixture: ComponentFixture<RCuestionarioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RCuestionarioComponent]
    });
    fixture = TestBed.createComponent(RCuestionarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
