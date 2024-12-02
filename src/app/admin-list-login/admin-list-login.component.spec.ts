import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminListLoginComponent } from './admin-list-login.component';

describe('AdminListLoginComponent', () => {
  let component: AdminListLoginComponent;
  let fixture: ComponentFixture<AdminListLoginComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminListLoginComponent]
    });
    fixture = TestBed.createComponent(AdminListLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
