import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { ItemStorageService } from './item-storage.service';
import { Item } from './item.model';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-item-page',
  templateUrl: './item-page.component.html',
  styleUrls: ['./item-page.component.css'],
  animations: [
    trigger('simpleFadeAnimation', [
      state('in', style({ opacity: 1 })),
      transition(':enter', [style({ opacity: 0 }), animate(1000)]),
    ]),
  ],
})
export class ItemPageComponent implements OnInit {
  // VISIBLE LISTS
  items: Item[];

  // SUBS
  private streamSub: Subscription;
  private idSub: Subscription;

  // ROUTE DATA
  id: string;
  hasFood: string;
  parentName: string;

  isLoading = false;

  constructor(
    private itemStorageService: ItemStorageService,
    private route: ActivatedRoute,
    private afStorage: AngularFireStorage
  ) {}

  ngOnInit() {
    // SHOW LOADING INDICATOR
    this.isLoading = true;

    // GET DATA FROM ROUTE
    this.idSub = this.route.params.subscribe((params: Params) => {
      if (params['id']) {
        this.id = params['id'];
        this.hasFood = params['hasFood'];
        this.parentName = params['name'];
      } else {
        this.id = 'items';
      }

      // GET ITEMS
      this.streamSub = this.itemStorageService
        .getItems(this.id, this.hasFood)
        .subscribe((items) => {
          // EMPTY LOCAL ITEMS
          this.items = [];

          // DEFINE NEW ITEM
          for (let item of items) {
            const imagePath = this.afStorage
              .ref(item.imagePath)
              .getDownloadURL();

            const fetchedItem = new Item(
              item.name,
              item.description,
              item.price,
              imagePath,
              item.isVisible,
              item.isFood,
              item.id,
              item.parentId,
              item.index
            );

            console.log(fetchedItem);

            // PUSH NEW ITEM
            this.items.push(fetchedItem);
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
