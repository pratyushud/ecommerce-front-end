import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order } from '../common/order';
import { Customer } from '../common/customer';
import { Address } from '../common/address';
import { OrderItem } from '../common/order-item';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { PaymentInfo } from '../common/payment-info';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  ecommerce_be_url: string = environment.ecommerce_be_url;
  url: string = this.ecommerce_be_url + '/checkout';

  constructor(private http: HttpClient) { }
  
  placeOrder(order: Order, customer: Customer, shippingAddress: Address, billingAddress: Address, orderItems: OrderItem[]): Observable<any> {
    let orderData = {
      order: order,
      customer: customer,
      shippingAddress: shippingAddress,
      billingAddress: billingAddress,
      orderItems: orderItems
    };
    return this.http.post(`${this.url}/purchase`, orderData);
  }

  createPaymentIntent(paymentInfo: PaymentInfo): Observable<any> {
    return this.http.post(`${this.url}/payment-intent`, paymentInfo);
  }
  
}
