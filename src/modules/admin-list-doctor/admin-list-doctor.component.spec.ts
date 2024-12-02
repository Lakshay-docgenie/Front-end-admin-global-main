import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminListDoctorComponent } from './admin-list-doctor.component';

describe('AdminListDoctorComponent', () => {
  let component: AdminListDoctorComponent;
  let fixture: ComponentFixture<AdminListDoctorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminListDoctorComponent]
    });
    fixture = TestBed.createComponent(AdminListDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
