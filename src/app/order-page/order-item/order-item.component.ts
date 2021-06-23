import { Component, Input, OnInit } from '@angular/core';

import { Order } from '../order.model';
import { OrderService } from '../order.service';

@Component({
  selector: 'app-order-item',
  templateUrl: './order-item.component.html',
  styleUrls: ['./order-item.component.css'],
})
export class OrderItemComponent implements OnInit {
  @Input() order: Order;

  constructor(private orderService: OrderService) {}

  ngOnInit() {}

  onAcceptOrder() {
    this.orderService.acceptOrder(this.order);
  }

  onDeleteOrder() {
    this.orderService.deleteOrder(this.order);
  }
}
