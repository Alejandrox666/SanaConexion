import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationCComponent } from './navigation-c.component';

describe('NavigationCComponent', () => {
  let component: NavigationCComponent;
  let fixture: ComponentFixture<NavigationCComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NavigationCComponent]
    });
    fixture = TestBed.createComponent(NavigationCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
