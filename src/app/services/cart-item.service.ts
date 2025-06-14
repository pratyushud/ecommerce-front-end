import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartItemService {
  cartItems: CartItem[] = [];
  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);
  localStorage: Storage = localStorage;

  constructor() {
    // Read cart items from session storage
    const data = this.localStorage.getItem('cartItems');
    if (data) {
      this.cartItems = JSON.parse(data);
      this.calculateAndUpdateTotals();
    }
  }

  addProductToCart(cartItem: CartItem) {
    let itemExists = false;
    if(this.cartItems.length > 0) {
      for(let item of this.cartItems) {
        if(item.id == cartItem.id) {
          item.quantity++;
          itemExists = true;
        }
      }
    }
    if(!itemExists) {
      this.cartItems.push(cartItem);
    }
    this.calculateAndUpdateTotals();
  }

  reduceProductFromCart(cartItem: CartItem) {
    if(this.cartItems.length > 0) {
      let item = this.cartItems.find(r => r.id == cartItem.id)!;
      if(item.quantity > 1) {
        item.quantity--;
      } else {
        let itemIndex = this.cartItems.findIndex(r => r.id == cartItem.id);
        this.cartItems.splice(itemIndex, 1);
      }
      this.calculateAndUpdateTotals();
    }
  }

  removeProductFromCart(cartItem: CartItem) {
    if(this.cartItems.length > 0) {
      let itemIndex = this.cartItems.findIndex(r => r.id == cartItem.id);
      this.cartItems.splice(itemIndex, 1);
      this.calculateAndUpdateTotals();
    }
  }

  calculateAndUpdateTotals() {
    let totalPriceValue = 0.00;
    let totalQuantityValue = 0;
    for(let item of this.cartItems) {
      totalPriceValue += (item.unitPrice * item.quantity);
      totalQuantityValue += item.quantity;
    }
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);
    this.localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
  }

  clearCart() {
    this.cartItems = [];
    this.calculateAndUpdateTotals();
  }
}
