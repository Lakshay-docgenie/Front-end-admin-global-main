import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceDetComponent } from './device-det.component';

describe('DeviceDetComponent', () => {
  let component: DeviceDetComponent;
  let fixture: ComponentFixture<DeviceDetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeviceDetComponent]
    });
    fixture = TestBed.createComponent(DeviceDetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
