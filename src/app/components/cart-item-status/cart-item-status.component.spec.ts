import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartItemStatusComponent } from './cart-item-status.component';

describe('CartItemStatusComponent', () => {
  let component: CartItemStatusComponent;
  let fixture: ComponentFixture<CartItemStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CartItemStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartItemStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
