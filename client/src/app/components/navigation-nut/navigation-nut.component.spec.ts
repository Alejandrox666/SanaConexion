import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationNutComponent } from './navigation-nut.component';

describe('NavigationNutComponent', () => {
  let component: NavigationNutComponent;
  let fixture: ComponentFixture<NavigationNutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NavigationNutComponent]
    });
    fixture = TestBed.createComponent(NavigationNutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
