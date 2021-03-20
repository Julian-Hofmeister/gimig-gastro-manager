import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Item } from './item.model';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private items: Item[] = [
    new Item(
      'Bruschetta',
      'Die geilste Bruschetta die die Welt je gesehen oder schmeckt hat hier bei uns!',
      9.95,
      'https://www.eat-this.org/wp-content/uploads/2020/06/eat_this_die_perfekte_vegane_pizza-22-1280x854.jpg',
      true
    ),
  ];

  itemsChanged = new Subject<Item[]>();
  editStatusChanged = new Subject<Item>();
  currentItem: Item;
  currentIndex: number;

  getItems() {
    return this.items.slice();
  }

  addItem(items: Item) {
    this.items.push(items);
    this.itemsChanged.next(this.items.slice());
  }

  deleteItem(index: number) {
    this.items.splice(index, 1);
    this.itemsChanged.next(this.items.slice());
  }

  updateItem(index: number, newItem: Item) {
    this.items[index] = newItem;
    this.itemsChanged.next(this.items.slice());
  }

  changeItemVisibilty(item: Item) {
    if (item.isVisible === true) {
      //LOGIC
      item.isVisible = false;
    } else {
      //LOGIC
      item.isVisible = true;
    }
  }

  editItem(item: Item, index: number) {
    this.currentItem = item;
    this.currentIndex = index;
    this.editStatusChanged.next(this.currentItem);
  }
}
