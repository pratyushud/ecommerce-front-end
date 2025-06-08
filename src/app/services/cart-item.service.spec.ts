import { TestBed } from '@angular/core/testing';

import { CartServiceService } from './cart-item.service';

describe('CartServiceService', () => {
  let service: CartServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
