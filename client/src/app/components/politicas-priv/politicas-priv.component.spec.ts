import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoliticasPrivComponent } from './politicas-priv.component';

describe('PoliticasPrivComponent', () => {
  let component: PoliticasPrivComponent;
  let fixture: ComponentFixture<PoliticasPrivComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PoliticasPrivComponent]
    });
    fixture = TestBed.createComponent(PoliticasPrivComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
