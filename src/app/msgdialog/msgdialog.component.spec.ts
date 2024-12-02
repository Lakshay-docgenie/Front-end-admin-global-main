import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsgdialogComponent } from './msgdialog.component';

describe('MsgdialogComponent', () => {
  let component: MsgdialogComponent;
  let fixture: ComponentFixture<MsgdialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MsgdialogComponent]
    });
    fixture = TestBed.createComponent(MsgdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
