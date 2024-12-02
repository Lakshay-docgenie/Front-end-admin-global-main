import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabtestOrderComponent } from './labtest-order.component';

describe('LabtestOrderComponent', () => {
  let component: LabtestOrderComponent;
  let fixture: ComponentFixture<LabtestOrderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LabtestOrderComponent]
    });
    fixture = TestBed.createComponent(LabtestOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
