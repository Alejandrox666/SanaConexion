import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReposicionContrasenaComponent } from './reposicion-contrasena.component';

describe('ReposicionContrasenaComponent', () => {
  let component: ReposicionContrasenaComponent;
  let fixture: ComponentFixture<ReposicionContrasenaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReposicionContrasenaComponent]
    });
    fixture = TestBed.createComponent(ReposicionContrasenaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
