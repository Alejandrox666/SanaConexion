import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaEspComponent } from './lista-esp.component';

describe('ListaEspComponent', () => {
  let component: ListaEspComponent;
  let fixture: ComponentFixture<ListaEspComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListaEspComponent]
    });
    fixture = TestBed.createComponent(ListaEspComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
