import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
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

  constructor(private itemService: ItemService) {}

  ngOnInit() {
    this.items = this.itemService.getItems();
    this.itemSub = this.itemService.itemsChanged.subscribe((items: Item[]) => {
      this.items = items;
    });
  }

  ngOnDestroy() {
    this.itemSub.unsubscribe();
  }
}
