import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Category } from 'src/app/category-page/category.model';
import { CategoryService } from 'src/app/category-page/category.service';
import { Item } from '../item.model';
import { ItemService } from '../item.service';

@Component({
  selector: 'app-create-item-card',
  templateUrl: './create-item-card.component.html',
  styleUrls: ['./create-item-card.component.css'],
})
export class CreateItemCardComponent implements OnInit, OnDestroy {
  createItemForm: FormGroup;
  fileText = 'Bild auswählen';
  category: Category;
  selectedFile = null;
  imagePath: any;
  imgURL: any;

  editModeSub: Subscription;
  isEditMode = false;
  item: Item;
  editIndex: number;

  constructor(private itemService: ItemService) {}

  ngOnInit() {
    // INIT FORM
    this.createItemForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
      price: new FormControl(null, [Validators.required]),
      imagePath: new FormControl(null, Validators.required),
    });

    // LISTEN TO EDIT REQUEST
    this.editModeSub = this.itemService.editStatusChanged.subscribe(
      (item: Item) => {
        this.onEditMode(item);
      }
    );
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.fileText = this.selectedFile.name;

    var files = event.target.files;

    if (files.length === 0) return;
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    var reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
    };
  }

  onSubmit() {
    //LOG
    console.log(this.createItemForm);

    //DEFINE VALUES
    const name = this.createItemForm.value.name;
    const description = this.createItemForm.value.description;
    const price = this.createItemForm.value.price;
    const imagePath = this.imgURL;
    const isVisible = true;

    this.item = new Item(name, description, price, imagePath, isVisible);

    // TAKE ACTION
    if (!this.isEditMode) {
      this.itemService.addItem(this.item);
    } else {
      console.log(this.itemService.currentIndex);
      this.itemService.updateItem(this.itemService.currentIndex, this.item);
      this.isEditMode = false;
    }

    //LOG
    console.log(this.itemService.getItems());

    //RESET
    this.imgURL = '';
    this.fileText = 'Bild auswählen';
    this.createItemForm.reset();
  }

  onEditMode(item: Item) {
    this.isEditMode = true;

    // SET FORM
    this.createItemForm = new FormGroup({
      name: new FormControl(item.name, Validators.required),
      description: new FormControl(item.description, Validators.required),
      price: new FormControl(item.price, [Validators.required]),
      imagePath: new FormControl(null),
    });
    this.imgURL = item.imagePath;
    this.fileText = item.imagePath;
  }

  ngOnDestroy() {
    this.editModeSub.unsubscribe();
  }
}
