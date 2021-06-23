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
  getItems(id: string, hasFood: string) {
    const pathAttachment = hasFood == 'true' ? 'items-food' : 'items-beverages';

    // GETS REFERENCE
    this.itemCollection = this.path.collection('/' + pathAttachment, (ref) =>
      ref.where('parentId', '==', id).orderBy("name")
    );

    // GETS ITEMS
    this.items = this.itemCollection.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((a) => {
          const data = a.payload.doc.data() as Item;
          data.id = a.payload.doc.id;

          // console.log(data);

          return data;
        });
      })
    );
    return this.items;
  }

  // ADD ITEM
  async addItem(item: Item, event: any, isFood: any) {
    const pathAttachment = isFood == 'true' ? 'items-food' : 'items-beverages';

    // GET IMG REFERNCE
    const randomId = Math.random().toString(36).substring(2);
    const imagePath: string = '/' + pathAttachment + '/' + randomId;
    this.ref = this.afStorage.ref(imagePath);
    // UPLOAD IMAGE TO FIREBASE STORAGE
    let task = await this.ref.put(event.target.files[0]);

    // ADD TO FIRESTORE IF IMG UPLOAD SUCCESSFUL
    console.log(task.state);
    if (task.state == 'success') {
      this.path.collection(pathAttachment).add({
        name: item.name,
        description: item.description,
        imagePath: imagePath,
        price: item.price,
        isVisible: item.isVisible,
        isFood: item.isFood,
        parentId: item.parentId,
        index: item.index,
      });
    } else {
      // CATCH ERRORS
      console.log('UPLOAD FAILED');
    }
  }

  async updateItem(changedItem: Item, event: any, downloadUrl: string) {
    // GET REFERENCE
    const pathAttachment = changedItem.isFood ? 'items-food' : 'items-beverages';
    this.itemDoc = this.path.collection(pathAttachment).doc(`${changedItem.id}`);

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
    // GET REFERENCE
    const pathAttachment = item.isFood ? 'items-food' : 'items-beverages';
    this.itemDoc = this.path.collection(pathAttachment).doc(`${item.id}`);

    this.itemDoc.delete();
    this.afStorage.storage.refFromURL(downloadUrl).delete();
  }

  changeItemVisibilty(item: Item) {
    // GET REFERENCE
    const pathAttachment = item.isFood ? 'items-food' : 'items-beverages';
    this.itemDoc = this.path.collection(pathAttachment).doc(`${item.id}`);

    this.itemDoc.update({ isVisible: !item.isVisible });
  }
}
