import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Category } from './category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private categories: Category[] = [
    new Category(
      'Vorspeisen',
      false,
      true,
      'https://www.lecker.de/assets/field/image/vorspeisen-b17.jpg',
      true
    ),
  ];

  categoriesChanged = new Subject<Category[]>();
  editStatusChanged = new Subject<Category>();
  currentCategory: Category;
  currentIndex: number;

  getCategories() {
    return this.categories.slice();
  }

  addCategory(category: Category) {
    this.categories.push(category);
    this.categoriesChanged.next(this.categories.slice());
  }

  deleteCategory(index: number) {
    this.categories.splice(index, 1);
    this.categoriesChanged.next(this.categories.slice());
  }

  updateCategory(index: number, newCategory: Category) {
    this.categories[index] = newCategory;
    this.categoriesChanged.next(this.categories.slice());
  }

  changeCategoryVisibilty(category: Category) {
    if (category.isVisible === true) {
      //LOGIC
      category.isVisible = false;
    } else {
      //LOGIC
      category.isVisible = true;
    }
  }

  editCategory(category: Category, index: number) {
    this.currentCategory = category;
    this.currentIndex = index;
    this.editStatusChanged.next(this.currentCategory);
  }
}
