import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Item } from './item.model';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  itemsChanged = new Subject<Item[]>();
  editStatusChanged = new Subject<Item>();
  currentItem: Item;
  currentIndex: number;

  editItem(item: Item, index: number) {
    this.currentItem = item;
    this.currentIndex = index;
    this.editStatusChanged.next(this.currentItem);
  }
}
