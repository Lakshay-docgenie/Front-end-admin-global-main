import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPrescListComponent } from './admin-presc-list.component';

describe('AdminPrescListComponent', () => {
  let component: AdminPrescListComponent;
  let fixture: ComponentFixture<AdminPrescListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminPrescListComponent]
    });
    fixture = TestBed.createComponent(AdminPrescListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
