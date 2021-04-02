import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Category } from './category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  editStatusChanged = new Subject<Category>();

  editCategory(category: Category) {
    this.editStatusChanged.next(category);
  }
}
