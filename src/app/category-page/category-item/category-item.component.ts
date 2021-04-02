import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { DataStorageService } from 'src/app/category-page/category-storage.service';
import { Category } from '../category.model';
import { CategoryService } from '../category.service';

@Component({
  selector: 'app-category-item',
  templateUrl: './category-item.component.html',
  styleUrls: ['./category-item.component.css'],
  animations: [
    trigger('simpleFadeAnimation', [
      state('in', style({ opacity: 1 })),
      transition(':enter', [style({ opacity: 0 }), animate(1000)]),
    ]),
  ],
})
export class CategoryItemComponent {
  @Input() category: Category;

  constructor(
    private categoryService: CategoryService,
    private dataStorageService: DataStorageService,
    private router: Router,
    public afs: AngularFirestore
  ) {}

  onDeleteCategory() {
    this.category.imagePath.subscribe((url) => {
      this.dataStorageService.deleteCategory(this.category, url);
    });
  }

  onChangeVisibility() {
    this.dataStorageService.changeCategoryVisibilty(this.category);
  }

  onOpenContent() {
    // CHECK CONTENT
    if (this.category.hasCategories) {
      this.router.navigate(['category/' + this.category.id]);
    } else {
      this.router.navigate([
        'items/' +
          this.category.id +
          '/' +
          this.category.hasFood +
          '/' +
          this.category.name,
      ]);
    }
  }

  onEditCategory() {
    this.categoryService.editCategory(this.category);
  }
}
