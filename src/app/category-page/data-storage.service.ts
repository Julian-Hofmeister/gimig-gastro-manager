import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Category } from './category.model';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  DocumentData,
} from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  categories: Observable<any[]>;
  categoryDoc: AngularFirestoreDocument<Category>;

  path: AngularFirestoreCollection<Category> = this.afs
    .collection('restaurants')
    .doc('julian@web.de')
    .collection('menu')
    .doc('food')
    .collection('categories');

  constructor(public afs: AngularFirestore) {}

  getCategories(path: AngularFirestoreCollection<DocumentData>) {
    // this.categories = path.valueChanges();
    this.categories = path.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((a) => {
          const data = a.payload.doc.data() as Category;
          data.id = a.payload.doc.id;
          console.log('DATA:');
          console.log(data);
          console.log(data.id);
          return data;
        });
      })
    );
    return this.categories;
  }

  addCategory(category: Category, path: AngularFirestoreCollection<Category>) {
    // DEFINE A JAVA SCRIPT OBJECT
    const catObject: Category = {
      name: category.name,
      hasCategories: category.hasCategories,
      hasFood: category.hasFood,
      imagePath: category.imagePath,
      isVisible: category.isVisible,
      id: null,
    };

    // ADD TO FIRESTORE
    path.add(catObject);
  }

  deleteCategory(
    category: Category,
    path: AngularFirestoreCollection<Category>
  ) {
    this.categoryDoc = path.doc(`${category.id}`);
    this.categoryDoc.delete();
  }

  updateCategory(
    changedCategory: Category,
    path: AngularFirestoreCollection<Category>
  ) {
    // DEFINE A JAVA SCRIPT OBJECT
    const catObject: Category = {
      name: changedCategory.name,
      hasCategories: changedCategory.hasCategories,
      hasFood: changedCategory.hasFood,
      imagePath: changedCategory.imagePath,
      isVisible: changedCategory.isVisible,
      id: changedCategory.id,
    };
    // UPDATE TO FIRESTORE
    this.categoryDoc = path.doc(`${changedCategory.id}`);
    this.categoryDoc.update(catObject);
  }

  changeCategoryVisibilty(
    category: Category,
    path: AngularFirestoreCollection<Category>
  ) {
    this.categoryDoc = path.doc(`${category.id}`);
    this.categoryDoc.update({ isVisible: !category.isVisible });
  }
}
