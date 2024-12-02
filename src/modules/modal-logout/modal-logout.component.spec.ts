import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalLogoutComponent } from './modal-logout.component';

describe('ModelLogoutComponent', () => {
  let component: ModalLogoutComponent;
  let fixture: ComponentFixture<ModalLogoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalLogoutComponent]
    });
    fixture = TestBed.createComponent(ModalLogoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
