import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Category } from '../category-page/category.model';
import { Item } from './item.model';

@Injectable({ providedIn: 'root' })
export class ItemStorageService {
  items: Observable<any[]>;
  itemDoc: AngularFirestoreDocument<Item>;

  path: AngularFirestoreCollection<Item> = this.afs
    .collection('restaurants')
    .doc('julian@web.de')
    .collection('menu')
    .doc('food')
    .collection('categories')
    .doc('Dessert')
    .collection('items');

  constructor(public afs: AngularFirestore) {}

  getItems(path: AngularFirestoreCollection<Item>) {
    this.items = path.snapshotChanges().pipe(
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
    return this.items;
  }

  addItem(item: Item, path: AngularFirestoreCollection<Item>) {
    // DEFINE A JAVA SCRIPT OBJECT
    const itemObject: Item = {
      name: item.name,
      description: item.description,
      imagePath: item.imagePath,
      price: item.price,
      isVisible: item.isVisible,
      id: null,
    };

    path.add(itemObject);
  }

  deleteItem(item: Item, path: AngularFirestoreCollection<Item>) {
    this.itemDoc = path.doc(`${item.id}`);
    this.itemDoc.delete();
  }

  updateItem(changedItem: Item, path: AngularFirestoreCollection<Item>) {
    console.log(changedItem.id);
    // DEFINE A JAVA SCRIPT OBJECT
    const itemObject: Item = {
      name: changedItem.name,
      description: changedItem.description,
      imagePath: changedItem.imagePath,
      price: changedItem.price,
      isVisible: changedItem.isVisible,
      id: changedItem.id,
    };
    // UPDATE TO FIRESTORE
    this.itemDoc = path.doc(`${changedItem.id}`);
    this.itemDoc.update(itemObject);
  }

  changeItemVisibilty(item: Item, path: AngularFirestoreCollection<Item>) {
    this.itemDoc = path.doc(`${item.id}`);
    this.itemDoc.update({ isVisible: !item.isVisible });
  }
}
