import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import {
  AngularFireStorage,
  AngularFireStorageReference,
  AngularFireUploadTask,
} from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Item } from './item.model';

@Injectable({ providedIn: 'root' })
export class ItemStorageService {
  items: Observable<any[]>;
  itemDoc: AngularFirestoreDocument<any>;

  userEmail = JSON.parse(localStorage.getItem('user')).email;

  path = this.afs.collection('restaurants').doc(this.userEmail);

  itemCollection: AngularFirestoreCollection<Item>;
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;

  constructor(
    public afs: AngularFirestore,
    private afStorage: AngularFireStorage
  ) {}

  // GET ITEMS
  getItems(id: string) {
    // GETS REFERENCE
    this.itemCollection = this.path.collection('/items', (ref) =>
      ref.where('parentId', '==', id)
    );

    // GETS ITEMS
    this.items = this.itemCollection.snapshotChanges().pipe(
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

  // ADD ITEM
  async addItem(item: Item, event: any) {
    // GET IMG REFERNCE
    const randomId = Math.random().toString(36).substring(2);
    const imagePath: string = '/items/' + randomId;
    this.ref = this.afStorage.ref(imagePath);
    // UPLOAD IMAGE TO FIREBASE STORAGE
    let task = await this.ref.put(event.target.files[0]);

    // ADD TO FIRESTORE IF IMG UPLOAD SUCCESSFUL
    console.log(task.state);
    if (task.state == 'success') {
      this.path.collection('items').add({
        name: item.name,
        description: item.description,
        imagePath: imagePath,
        price: item.price,
        isVisible: item.isVisible,
        isFood: item.isFood,
        parentId: item.parentId,
      });
    } else {
      // CATCH ERRORS
      console.log('UPLOAD FAILED');
    }
  }

  async updateItem(changedItem: Item, event: any, downloadUrl: string) {
    // GET REFERENCE
    this.itemDoc = this.path.collection('items').doc(`${changedItem.id}`);

    // UPDATE IMG IF CHANGED
    if (event != null) {
      // GET IMG REFERNCE
      const randomId = Math.random().toString(36).substring(2);
      var imagePath = '/items/' + randomId;
      this.ref = this.afStorage.ref(imagePath);
      // UPLOAD IMAGE TO FIREBASE STORAGE
      var task = await this.ref.put(event.target.files[0]);

      if (task.state == 'success') {
        // UPDATE CATEGORY IMG
        this.itemDoc.update({ imagePath: imagePath });
        // DELETE OLD CATEGORY IMG
        this.afStorage.storage.refFromURL(downloadUrl).delete();
      }
    }

    // UPDATE ITEM TO FIRESTORE
    this.itemDoc.update({
      name: changedItem.name,
      description: changedItem.description,
      price: changedItem.price,
      isVisible: changedItem.isVisible,
      id: changedItem.id,
    });
  }

  deleteItem(item: Item, downloadUrl: string) {
    this.itemDoc = this.path.collection('items').doc(`${item.id}`);
    this.itemDoc.delete();
    this.afStorage.storage.refFromURL(downloadUrl).delete();
  }

  changeItemVisibilty(item: Item) {
    this.itemDoc = this.path.collection('items').doc(`${item.id}`);
    this.itemDoc.update({ isVisible: !item.isVisible });
  }
}
