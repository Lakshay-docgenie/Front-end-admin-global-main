import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminListLabtestComponent } from './admin-list-labtest.component';

describe('AdminListLabtestComponent', () => {
  let component: AdminListLabtestComponent;
  let fixture: ComponentFixture<AdminListLabtestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminListLabtestComponent]
    });
    fixture = TestBed.createComponent(AdminListLabtestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
