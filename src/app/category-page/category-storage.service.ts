import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Category } from './category.model';
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

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  categories: Observable<any[]>;
  categoryDoc: AngularFirestoreDocument<any>;

  userEmail = JSON.parse(localStorage.getItem('user')).email;
  path = this.afs.collection('restaurants').doc(this.userEmail);

  categoryCollection: AngularFirestoreCollection<Category>;
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;

  constructor(
    public afs: AngularFirestore,
    private afStorage: AngularFireStorage
  ) {}

  // GET CATEGORIES
  getCategories(id: string) {
    // GETS REFERENCE
    this.categoryCollection = this.path.collection('/categories', (ref) =>
      ref.where('parentId', '==', id)
    );

    // GETS CATEGORIES
    this.categories = this.categoryCollection.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((a) => {
          const data = a.payload.doc.data() as Category;
          data.id = a.payload.doc.id;
          return data;
        });
      })
    );
    return this.categories;
  }

  // ADD CATEGORY
  async addCategory(category: Category, event: any) {
    // GET IMG REFERNCE
    const randomId = Math.random().toString(36).substring(2);
    const imagePath: string = '/categories/' + randomId;
    this.ref = this.afStorage.ref(imagePath);
    // UPLOAD IMAGE TO FIREBASE STORAGE
    let task = await this.ref.put(event.target.files[0]);

    // ADD NEW CATEGORY TO FIRESTORE IF IMG UPLOAD SUCCESSFUL
    console.log(task.state);
    if (task.state == 'success') {
      this.path.collection('categories').add({
        name: category.name,
        hasCategories: category.hasCategories,
        hasFood: category.hasFood,
        imagePath: imagePath,
        isVisible: category.isVisible,
        parentId: category.parentId,
      });
    } else {
      // CATCH ERRORS
      console.log('UPLOAD FAILED');
    }
  }

  async updateCategory(
    changedCategory: Category,
    event: any,
    downloadUrl: string
  ) {
    // GET REFERENCE
    this.categoryDoc = this.path
      .collection('categories')
      .doc(`${changedCategory.id}`);

    // UPDATE IMG IF CHANGED
    if (event != null) {
      // GET IMG REFERNCE
      const randomId = Math.random().toString(36).substring(2);
      var imagePath = '/categories/' + randomId;
      this.ref = this.afStorage.ref(imagePath);
      // UPLOAD IMAGE TO FIREBASE STORAGE
      var task = await this.ref.put(event.target.files[0]);

      if (task.state == 'success') {
        // UPDATE CATEGORY IMG
        this.categoryDoc.update({ imagePath: imagePath });
        // DELETE OLD CATEGORY IMG
        this.afStorage.storage.refFromURL(downloadUrl).delete();
      }
    }

    // UPDATE CATEGORY DATA TO FIRESTORE
    this.categoryDoc.update({
      name: changedCategory.name,
      hasFood: changedCategory.hasFood,
      isVisible: changedCategory.isVisible,
    });
  }

  deleteCategory(category: Category, downloadUrl: string) {
    // IF ARRAY CONTAINS SUBCATEGORIES DELETING IS NOT POSSIBLE
    var subCategoryArray: string[] = [];
    var itemsArray = [];

    var storage = this.afStorage;

    console.log(downloadUrl);

    // DOCUMENT REFERENCE TO ID
    var categoryDoc = this.path.collection('categories').doc(`${category.id}`);

    // REFERENCE TO SUBCATEGORIES
    var subCategories = this.path.collection('/categories', (ref) =>
      ref.where('parentId', '==', category.id)
    );

    // REFERENCE TO ITEMS
    var items = this.path.collection('/items', (ref) =>
      ref.where('parentId', '==', category.id)
    );

    // SEARCHES FOR SUBCATEGORIES
    if (category.hasCategories) {
      subCategories.get().subscribe(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          subCategoryArray.push(doc.ref.id);
        });
        // CHECKS SUBCATEGORIES
        if (subCategoryArray.length === 0) {
          // DELETES DOCUMENT
          categoryDoc.delete();
          storage.refFromURL(downloadUrl).delete();
          console.log('CATEGORY DELETED CATEGORIES');
        } else {
          // LOGS CONFIRMATION MESSAGE
          window.alert(
            'Löschen nicht möglich! Bitte löschen sie zuerst alle Unterkategorien'
          );
        }
      });
    } else {
      items.get().subscribe(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          itemsArray.push(doc.ref);
        });
        // CHECKS SUBCATEGORIES
        if (itemsArray.length === 0) {
          // DELETES DOCUMENT
          categoryDoc.delete();
          storage.refFromURL(downloadUrl).delete();
          console.log('CATEGORY DELETED ITEMS');
        } else {
          // LOGS CONFIRMATION MESSAGE
          if (
            window.confirm(
              'Diese Kategorie enthält Items!\nBist du sicher dass du vortfahren möchtest?'
            )
          ) {
            categoryDoc.delete();
            console.log('CATEGORY DELETED ITEMS');
            itemsArray.forEach((item) => {
              console.log(item);

              item.delete();
            });
          }
        }
      });
    }
  }

  changeCategoryVisibilty(category: Category) {
    this.categoryDoc = this.path.collection('categories').doc(`${category.id}`);
    this.categoryDoc.update({ isVisible: !category.isVisible });
  }
}
