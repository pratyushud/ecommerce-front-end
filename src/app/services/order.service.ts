import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order } from '../common/order';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  ecommerce_be_url: string = environment.ecommerce_be_url;
  url: string = this.ecommerce_be_url + '/orders/search/findByCustomerEmail';
  constructor(private http: HttpClient) { }

  getOrderHistory(email: string, thePage: number, thePageSize: number,) {
    return this.http.get<OrderHistoryResponse>(`${this.url}?email=${email}&page=${thePage}&size=${thePageSize}&sort=dateCreated,desc`);
  }
}

interface OrderHistoryResponse {
  _embedded: {
    orders: Order[];
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}
