import { Component, Input, OnInit } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { DataStorageService } from 'src/app/category-page/data-storage.service';
import { Category } from '../category.model';
import { CategoryService } from '../category.service';

@Component({
  selector: 'app-category-item',
  templateUrl: './category-item.component.html',
  styleUrls: ['./category-item.component.css'],
})
export class CategoryItemComponent implements OnInit {
  @Input() category: Category;
  @Input() index: number;

  constructor(
    private categoryService: CategoryService,
    private dataStorageService: DataStorageService,
    private router: Router,
    private route: ActivatedRoute,
    public afs: AngularFirestore
  ) {}

  ngOnInit(): void {}

  onDeleteCategory() {
    this.dataStorageService.deleteCategory(
      this.category,
      this.dataStorageService.path
    );
  }

  onChangeVisibility() {
    this.dataStorageService.changeCategoryVisibilty(
      this.category,
      this.dataStorageService.path
    );
  }

  onOpenContent() {
    if (this.category.hasCategories) {
      this.router.navigateByUrl('category/category', {
        state: { id: this.category.id },
      });
      this.dataStorageService.path = this.dataStorageService.path
        .doc(this.category.id)
        .collection('categories');
      console.log(this.dataStorageService.path);
    } else {
      this.router.navigate(['items']);
      this.dataStorageService.path = this.dataStorageService.path
        .doc(this.category.id)
        .collection('items');
      console.log(this.dataStorageService.path);
    }
  }

  onEditCategory() {
    this.categoryService.editCategory(this.category, this.index);
  }
}
