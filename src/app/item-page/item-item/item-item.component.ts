import { Component, Input, OnInit } from '@angular/core';
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

  constructor(private itemService: ItemService) {}

  ngOnInit(): void {}

  onDeleteItem() {
    this.itemService.deleteItem(this.index);
  }

  onChangeVisibility() {
    this.itemService.changeItemVisibilty(this.item);
  }

  onEditItem() {
    this.itemService.editItem(this.item, this.index);
  }
}
