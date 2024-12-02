import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminListAppointmentsComponent } from './admin-list-appointments.component';

describe('AdminListAppointmentsComponent', () => {
  let component: AdminListAppointmentsComponent;
  let fixture: ComponentFixture<AdminListAppointmentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminListAppointmentsComponent]
    });
    fixture = TestBed.createComponent(AdminListAppointmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
