import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaClienteComponent } from './vista-cliente.component';

describe('VistaClienteComponent', () => {
  let component: VistaClienteComponent;
  let fixture: ComponentFixture<VistaClienteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VistaClienteComponent]
    });
    fixture = TestBed.createComponent(VistaClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
