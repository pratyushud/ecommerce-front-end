import { Component, OnInit } from '@angular/core';
import { CartItemService } from '../../services/cart-item.service';
import { CartItem } from '../../common/cart-item';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart-item-status',
  templateUrl: './cart-item-status.component.html',
  styleUrls: ['./cart-item-status.component.css'],
  imports: [CommonModule]
})
export class CartItemStatusComponent implements OnInit {
  totalPrice: number = 0.00;
  totalQuantity: number = 0; 

  constructor(private cartService: CartItemService) { }

  ngOnInit(): void {
    this.updateCartStatus();
  }

  updateCartStatus() {
    this.cartService.totalPrice.subscribe(data => {
      this.totalPrice = data;
    })
    
    this.cartService.totalQuantity.subscribe(data => {
      this.totalQuantity = data;
    })
  }

}
