import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentData,
} from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { DataStorageService } from './data-storage.service';
import { Category } from './category.model';
import { CategoryService } from './category.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-category-page',
  templateUrl: './category-page.component.html',
  styleUrls: ['./category-page.component.css'],
})
export class CategoryPageComponent implements OnInit, OnDestroy {
  categories: Category[] = [];
  private categorySub: Subscription;
  private streamSub: Subscription;

  private path = this.dataStorageService.path;

  constructor(
    private categoryService: CategoryService,
    private dataStorageService: DataStorageService
  ) {}

  ngOnInit() {
    this.streamSub = this.dataStorageService
      .getCategories(this.path)
      .subscribe((categories) => {
        // EMPTY LOCAL CATEGORIES
        this.categories = [];

        // DEFINE NEW CATEGORY
        for (let category of categories) {
          const fetchedCategory = new Category(
            category.name,
            category.hasCategories,
            category.hasFood,
            category.imagePath,
            category.isVisible,
            category.id
          );

          // PUSH NEW CATEGORY
          this.categories.push(fetchedCategory);
        }
      });

    this.categorySub = this.categoryService.categoriesChanged.subscribe(
      (categories: Category[]) => {
        this.categories = categories;
      }
    );
  }

  ngOnDestroy() {
    this.categorySub.unsubscribe();
    this.streamSub.unsubscribe();
  }
}
