import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Item } from './item.model';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  editStatusChanged = new Subject<Item>();

  editItem(item: Item) {
    this.editStatusChanged.next(item);
  }
}
