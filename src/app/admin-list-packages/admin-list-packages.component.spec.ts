import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminListPackagesComponent } from './admin-list-packages.component';

describe('AdminListPackagesComponent', () => {
  let component: AdminListPackagesComponent;
  let fixture: ComponentFixture<AdminListPackagesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminListPackagesComponent]
    });
    fixture = TestBed.createComponent(AdminListPackagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
