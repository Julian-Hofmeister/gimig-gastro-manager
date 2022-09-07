import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ItemStorageService } from '../item-storage.service';
import { Item } from '../item.model';
import { ItemService } from '../item.service';

@Component({
  selector: 'app-create-item-card',
  templateUrl: './create-item-card.component.html',
  styleUrls: ['./create-item-card.component.css'],
})
export class CreateItemCardComponent implements OnInit, OnDestroy {
  item: Item;

  // INPUT
  @Input() parentId: string;
  @Input() isFood: boolean;
  @Input() items: Item[];

  // FORM
  createItemForm: FormGroup;

  fileText = 'Bild auswählen';
  selectedFile = null;
  imagePath: any;
  imgURL: any;
  id: string;
  uploadFile: any;

  // EDIT
  editModeSub: Subscription;
  isEditMode = false;
  editImage: any;
  downloadUrl: string;

  constructor(
    private itemService: ItemService,
    private itemStorageService: ItemStorageService,
    public afs: AngularFirestore
  ) {}

  ngOnInit() {
    // INIT FORM
    this.createItemForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
      price: new FormControl(null, [Validators.required]),
      imagePath: new FormControl(null, Validators.required),
      availableOptions: new FormControl(null),
      availableOptions2: new FormControl(null),
    });

    // LISTEN TO EDIT REQUEST
    this.editModeSub = this.itemService.editStatusChanged.subscribe(
      (item: Item) => {
        this.onEditMode(item);
      }
    );
  }

  // CHOOSE IMAGE
  onFileSelected(event: any) {
    this.uploadFile = event;

    this.selectedFile = event.target.files[0];
    var files = event.target.files;

    // CHECK FILE SIZE
    const fileSize = Math.round(this.selectedFile.size / 1000);

    if (fileSize > 900) {
      window.confirm(
        'Die Datei ist zu groß. (' +
          fileSize +
          'kb)\nDie maximale Dateigröße liegt bei 900kb.'
      );
      return;
    }

    // CHECK EMPTY
    if (files.length === 0) return;

    // CHECK FILE TYPE
    var mimeType = files[0].type;

    if (mimeType.match(/image\/*/) == null) {
      window.confirm(
        'Die Datei kann nicht als Bild erkannt werden. Bitte verwenden sie nur gängige Dateiformate'
      );
      return;
    }

    // SET FILE NAME AS TEXT
    this.fileText = this.selectedFile.name;

    // SET FILE
    var reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
    };
  }

  // SUBMIT FORM
  onSubmit() {
    //DEFINE VALUES
    const name = this.createItemForm.value.name;
    const description = this.createItemForm.value.description;
    const price = this.createItemForm.value.price;
    const isFood = this.isFood.toString() == 'true' ? true : false;
    const imagePath = this.imgURL;
    const isVisible = true;
    const index = this.items.length + 1;

    let availableOptions = this.createItemForm.value.availableOptions;

    let availableOptions2 = this.createItemForm.value.availableOptions2;

    console.log(this.createItemForm.value.availableOptions.length);

    try {
      availableOptions = this.createItemForm.value.availableOptions.split(',');
    } catch (e) {
      availableOptions = this.createItemForm.value.availableOptions;
    }

    try {
      availableOptions2 =
        this.createItemForm.value.availableOptions2.split(',');
    } catch (e) {
      availableOptions2 = this.createItemForm.value.availableOptions2;
    }

    // DEFINE ITEM
    this.item = {
      name,
      description,
      price,
      imagePath,
      isVisible,
      isFood,
      id: this.id,
      parentId: this.parentId,
      index,
      availableOptions,
      availableOptions2,
    };

    // CHECK ACTION
    if (!this.isEditMode) {
      // CREATE ITEM
      this.itemStorageService.addItem(this.item, this.uploadFile, this.isFood);
    } else {
      // UPDATE ITEM
      this,
        this.itemStorageService.updateItem(
          this.item,
          this.uploadFile,
          this.downloadUrl
        );

      // RESET EDIT MODE
      this.isEditMode = false;
    }

    //RESET FORM
    this.imgURL = '';
    this.editImage = null;
    this.imagePath = null;
    this.uploadFile = null;
    this.fileText = 'Bild auswählen';
    this.createItemForm.reset();
  }

  onEditMode(item: Item) {
    // SET EDIT MODE
    this.isEditMode = true;
    this.item = item;
    this.imgURL = null;
    this.uploadFile = null;

    item.imagePath.subscribe((url) => {
      this.downloadUrl = url;
    });

    // SET FORM
    this.createItemForm = new FormGroup({
      name: new FormControl(item.name, Validators.required),
      description: new FormControl(item.description, Validators.required),
      price: new FormControl(item.price, [Validators.required]),
      imagePath: new FormControl(null),
      availableOptions: new FormControl(item.availableOptions),
      availableOptions2: new FormControl(item.availableOptions2),
    });
    this.editImage = item.imagePath;
    this.id = item.id;
  }

  ngOnDestroy() {
    // DESTROY SUBS
    this.editModeSub.unsubscribe();
  }
}
