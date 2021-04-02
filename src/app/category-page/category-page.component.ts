import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { DataStorageService } from './category-storage.service';
import { Category } from './category.model';
import { ActivatedRoute, Params } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-category-page',
  templateUrl: './category-page.component.html',
  styleUrls: ['./category-page.component.css'],
  animations: [
    trigger('simpleFadeAnimation', [
      state('in', style({ opacity: 1 })),
      transition(':enter', [style({ opacity: 0 }), animate(1000)]),
    ]),
  ],
})
export class CategoryPageComponent implements OnInit, OnDestroy {
  // VISIBLE LISTS
  foodCategories: Category[] = [];
  beverageCategories: Category[] = [];

  // SUBS
  private streamSub: Subscription;
  private idSub: Subscription;

  id: string;
  isLoading = false;

  constructor(
    private dataStorageService: DataStorageService,
    private route: ActivatedRoute,
    private afStorage: AngularFireStorage
  ) {}

  ngOnInit() {
    // SHOW LOADING INDICATOR
    this.isLoading = true;

    // GET PARENT ID FROM ROUTE
    this.idSub = this.route.params.subscribe((params: Params) => {
      if (params['id']) {
        this.id = params['id'];
      } else {
        this.id = 'categories';
      }

      // GET CATEGORIES
      this.streamSub = this.dataStorageService
        .getCategories(this.id)
        .subscribe((categories) => {
          // EMPTY LOCAL CATEGORIES
          this.foodCategories = [];
          this.beverageCategories = [];

          // DEFINE NEW CATEGORY
          for (let category of categories) {
            const imagePath = this.afStorage
              .ref(category.imagePath)
              .getDownloadURL();

            const fetchedCategory = new Category(
              category.name,
              category.hasCategories,
              category.hasFood,
              imagePath,
              category.isVisible,
              category.id,
              category.parentId
            );

            // PUSH NEW CATEGORY
            if (fetchedCategory.hasFood === true) {
              this.foodCategories.push(fetchedCategory);
            } else {
              this.beverageCategories.push(fetchedCategory);
            }
          }

          // STOP LOADING INDICATOR
          this.isLoading = false;
        });
    });
  }

  ngOnDestroy() {
    // DESTROY SUBS
    this.streamSub.unsubscribe();
    this.idSub.unsubscribe();
  }
}
