import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Subscription } from 'rxjs';
import { Item } from '../item-page/item.model';
import { OrderService } from './order.service';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Order } from './order.model';

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.css'],
  animations: [
    trigger('simpleFadeAnimation', [
      state('in', style({ opacity: 1 })),
      transition(':enter', [style({ opacity: 0 }), animate(1000)]),
    ]),
  ],
})
export class OrderPageComponent implements OnInit {
  loadedOrders: Order[];

  private streamSub: Subscription;

  constructor(
    private orderService: OrderService,
    private afStorage: AngularFireStorage
  ) {}

  ngOnInit() {
    // GET ITEMS
    this.streamSub = this.orderService.getOrders().subscribe((loadedOrders) => {
      // EMPTY LOCAL ITEMS
      this.loadedOrders = [];

      // DEFINE NEW ITEM
      for (let order of loadedOrders) {
        const imagePath = this.afStorage.ref(order.imagePath).getDownloadURL();

        const fetchedOrder = new Order(
          order.amount,
          order.description,
          order.id,
          imagePath,

          order.isAccepted,
          order.isFood,
          order.isOrdered,
          order.isPaid,
          order.isServed,
          order.isVisible,

          order.name,
          order.parentId,
          order.price,

          order.tableNumber,
          order.timestamp
        );

        // PUSH NEW ITEM
        this.loadedOrders.push(fetchedOrder);
      }
    });
  }
}
