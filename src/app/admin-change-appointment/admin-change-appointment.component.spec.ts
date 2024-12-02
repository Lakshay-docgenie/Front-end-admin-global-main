import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminChangeAppointmentComponent } from './admin-change-appointment.component';

describe('AdminChangeAppointmentComponent', () => {
  let component: AdminChangeAppointmentComponent;
  let fixture: ComponentFixture<AdminChangeAppointmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminChangeAppointmentComponent]
    });
    fixture = TestBed.createComponent(AdminChangeAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
