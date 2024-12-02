import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminListPatientComponent } from './admin-list-patient.component';

describe('AdminListPatientComponent', () => {
  let component: AdminListPatientComponent;
  let fixture: ComponentFixture<AdminListPatientComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminListPatientComponent]
    });
    fixture = TestBed.createComponent(AdminListPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
