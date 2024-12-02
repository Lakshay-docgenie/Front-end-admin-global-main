import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogInactiveUserComponent } from './dialog-inactive-user.component';

describe('DialogInactiveUserComponent', () => {
  let component: DialogInactiveUserComponent;
  let fixture: ComponentFixture<DialogInactiveUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogInactiveUserComponent]
    });
    fixture = TestBed.createComponent(DialogInactiveUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
