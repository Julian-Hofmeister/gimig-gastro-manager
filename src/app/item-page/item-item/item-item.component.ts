import { Component, Input, OnInit } from '@angular/core';
import { ItemStorageService } from '../item-storage.service';
import { Item } from '../item.model';
import { ItemService } from '../item.service';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-item-item',
  templateUrl: './item-item.component.html',
  styleUrls: ['./item-item.component.css'],
  animations: [
    trigger('simpleFadeAnimation', [
      state('in', style({ opacity: 1 })),
      transition(':enter', [style({ opacity: 0 }), animate(1000)]),
    ]),
  ],
})
export class ItemItemComponent implements OnInit {
  @Input() item: Item;

  constructor(
    private itemService: ItemService,
    private itemStorageService: ItemStorageService
  ) {}

  ngOnInit(): void {}

  onDeleteItem() {
    this.item.imagePath.subscribe((url) => {
      this.itemStorageService.deleteItem(this.item, url);
    });
  }

  onChangeVisibility() {
    this.itemStorageService.changeItemVisibilty(this.item);
  }

  onEditItem() {
    this.itemService.editItem(this.item);
  }
}
