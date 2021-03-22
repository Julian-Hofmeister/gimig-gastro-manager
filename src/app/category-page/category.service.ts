import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Category } from './category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  categoriesChanged = new Subject<Category[]>();
  editStatusChanged = new Subject<Category>();
  currentCategory: Category;
  currentIndex: number;

  editCategory(category: Category, index: number) {
    this.currentCategory = category;
    this.currentIndex = index;
    this.editStatusChanged.next(this.currentCategory);
  }
}
