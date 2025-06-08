import { Component, OnInit } from '@angular/core';
import { CartItemService } from '../../services/cart-item.service';
import { CartItem } from '../../common/cart-item';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css'],
  imports: [CommonModule]
})
export class CartDetailsComponent implements OnInit {

  cartItems: CartItem[] = [];
  totalPrice: number = 0.00;
  totalQuantity: number = 0;

  constructor(private cartService: CartItemService) { }

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart() {
    this.cartItems = this.cartService.cartItems;
    
    this.cartService.totalPrice.subscribe(data => {
      this.totalPrice = data;
    })
    
    this.cartService.totalQuantity.subscribe(data => {
      this.totalQuantity = data;
    })

    this.cartService.calculateAndUpdateTotals();
  }

  addToCart(item: CartItem) {
    this.cartService.addProductToCart(item);
  }

  reduceItemFromCart(item: CartItem) {
    this.cartService.reduceProductFromCart(item);
  }

  removeItemFromCart(item: CartItem) {
    this.cartService.removeProductFromCart(item);
  }

}
