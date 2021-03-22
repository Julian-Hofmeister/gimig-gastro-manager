import { Component, Input, OnInit } from '@angular/core';
import { ItemStorageService } from '../item-storage.service';
import { Item } from '../item.model';
import { ItemService } from '../item.service';

@Component({
  selector: 'app-item-item',
  templateUrl: './item-item.component.html',
  styleUrls: ['./item-item.component.css'],
})
export class ItemItemComponent implements OnInit {
  @Input() item: Item;
  @Input() index: number;

  constructor(
    private itemService: ItemService,
    private itemStorageService: ItemStorageService
  ) {}

  ngOnInit(): void {}

  onDeleteItem() {
    this.itemStorageService.deleteItem(this.item, this.itemStorageService.path);
  }

  onChangeVisibility() {
    this.itemStorageService.changeItemVisibilty(
      this.item,
      this.itemStorageService.path
    );
  }

  onEditItem() {
    this.itemService.editItem(this.item, this.index);
  }
}
