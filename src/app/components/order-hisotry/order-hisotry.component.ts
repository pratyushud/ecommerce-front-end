import { Component } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { Order } from '../../common/order';
import { CommonModule } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-order-hisotry',
  imports: [NgbPaginationModule, CommonModule],
  templateUrl: './order-hisotry.component.html',
  styleUrl: './order-hisotry.component.css'
})
export class OrderHisotryComponent {
  customerOrders : Order[] = [];
  thePageNumber: number = 1;
  thePageSize: number = 10;
  pageMaxSize: number = 4;
  pageSize: string = "10";
  theTotalElements: number = 0;
  storage: Storage = sessionStorage

  constructor(
    private orderService: OrderService
  ) { }

  ngOnInit() {
    this.getOrderHistory();
  }

  getOrderHistory() {
    let email = this.storage.getItem('loggedInUserEmail') || '';
    this.orderService.getOrderHistory(email, this.thePageNumber - 1, this.thePageSize, ).subscribe(data => {
      this.customerOrders = data._embedded.orders;
          this.thePageNumber = data.page.number + 1,
          this.thePageSize = data.page.size,
          this.theTotalElements = data.page.totalElements
    });
  }

  updatePageSize(pageSize: string) {
    this.thePageSize = +pageSize;
    this.thePageNumber = 1;
    this.getOrderHistory();
  }

}
