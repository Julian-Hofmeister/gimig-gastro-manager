import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataStorageService } from '../category-page/data-storage.service';
import { ItemStorageService } from './item-storage.service';
import { Item } from './item.model';
import { ItemService } from './item.service';

@Component({
  selector: 'app-item-page',
  templateUrl: './item-page.component.html',
  styleUrls: ['./item-page.component.css'],
})
export class ItemPageComponent implements OnInit {
  items: Item[];
  private itemSub: Subscription;
  private streamSub: Subscription;

  private path = this.itemStorageService.path;

  constructor(
    private itemService: ItemService,
    private dataStorageService: DataStorageService,
    private itemStorageService: ItemStorageService
  ) {}

  ngOnInit() {
    this.streamSub = this.itemStorageService
      .getItems(this.path)
      .subscribe((items) => {
        // EMPTY LOCAL ITEMS
        this.items = [];

        // DEFINE NEW ITEM
        for (let item of items) {
          const fetchedItem = new Item(
            item.name,
            item.description,
            item.price,
            item.imagePath,
            item.isVisible,
            item.id
          );

          // PUSH NEW ITEM
          this.items.push(fetchedItem);
        }
      });

    this.itemSub = this.itemService.itemsChanged.subscribe((items: Item[]) => {
      this.items = items;
    });
  }

  ngOnDestroy() {
    this.itemSub.unsubscribe();
    this.streamSub.unsubscribe();
  }
}
