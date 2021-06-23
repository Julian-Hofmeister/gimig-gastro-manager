import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Item } from '../item-page/item.model';
import { Order } from './order.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  orders: Observable<any[]>;

  itemCollection: AngularFirestoreCollection<Item>;

  userEmail = JSON.parse(localStorage.getItem('user')).email;
  path = this.afs.collection('restaurants').doc(this.userEmail);

  orderDoc: AngularFirestoreDocument<any>;

  constructor(public afs: AngularFirestore) {}

  // GET ITEMS
  getOrders() {
    // GETS REFERENCE
    this.itemCollection = this.path.collection('/orders', (ref) =>
      ref.where('isAccepted', '==', false)
    );

    // GETS ITEMS
    this.orders = this.itemCollection.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((a) => {
          const data = a.payload.doc.data() as Item;
          data.id = a.payload.doc.id;
          console.log('DATA:');
          console.log(data);
          console.log(data.id);
          return data;
        });
      })
    );
    return this.orders;
  }

  acceptOrder(order: Order) {
    // GET REFERENCE
    this.orderDoc = this.path.collection('orders').doc(order.id);

    // UPDATE ORDER TO FIRESTORE
    this.orderDoc.update({
      isAccepted: true,
      isOrdered: false,
    });
  }

  deleteOrder(order: Order) {
    // GET REFERENCE
    this.orderDoc = this.path.collection('orders').doc(order.id);

    // UPDATE ORDER TO FIRESTORE
    this.orderDoc.delete();
  }
}
