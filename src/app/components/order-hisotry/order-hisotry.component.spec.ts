import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderHisotryComponent } from './order-hisotry.component';

describe('OrderHisotryComponent', () => {
  let component: OrderHisotryComponent;
  let fixture: ComponentFixture<OrderHisotryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderHisotryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderHisotryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
