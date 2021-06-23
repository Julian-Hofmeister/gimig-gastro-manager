import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DataStorageService } from 'src/app/category-page/category-storage.service';
import { Category } from '../category.model';
import { CategoryService } from '../category.service';

@Component({
  selector: 'app-create-category-card',
  templateUrl: './create-category-card.component.html',
  styleUrls: ['./create-category-card.component.css'],
})
export class CreateCategoryCardComponent implements OnInit {
  category: Category;

  // INPUT
  @Input() parentId: string;
  @Input() foodSelected: boolean;

  // FORM
  createCategoryForm: FormGroup;
  fileText = 'Kategorie Bild auswählen';
  selectedFile = null;
  imagePath: any;
  imgURL: any;
  id: string;
  uploadFile: any;

  // SUBS
  editModeSub: Subscription;

  // EDIT MODE
  isEditMode = false;
  editImage: any;
  downloadUrl: string;

  constructor(
    private categoryService: CategoryService,
    private dataStorageService: DataStorageService,
    public afs: AngularFirestore
  ) {}

  ngOnInit() {
    console.log(this.foodSelected);
    // INIT FORM
    this.createCategoryForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      hasCategories: new FormControl(false, Validators.required),
      hasFood: new FormControl(false, Validators.required),
      imagePath: new FormControl(null, Validators.required),
    });

    // LISTEN TO EDIT REQUEST
    this.editModeSub = this.categoryService.editStatusChanged.subscribe(
      (category: Category) => {
        this.onEditMode(category);
      }
    );
  }

  // CHOOSE IMAGE
  onFileSelected(event: any) {
    console.log(this.foodSelected);
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
    // DEFINE VALUES
    const name = this.createCategoryForm.value.name;
    const imagePath = this.imgURL;
    const isVisible = true;
    const hasFood =
      this.createCategoryForm.value.hasFood.toString() == 'true' ? true : false;
    const hasCategories =
      this.createCategoryForm.value.hasCategories.toString() == 'true'
        ? true
        : false;

    // DEFINE NEW CATEGORY
    this.category = new Category(
      name,
      hasCategories,
      this.foodSelected,
      imagePath,
      isVisible,
      this.id,
      this.parentId
    );

    // CHECK ACTION
    if (!this.isEditMode) {
      // CREATE CATEGORY
      this.dataStorageService.addCategory(this.category, this.uploadFile);
    } else {
      // UPDATE CATEGORY
      this.dataStorageService.updateCategory(
        this.category,
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
    this.createCategoryForm.reset();
  }

  onEditMode(category: Category) {
    this.isEditMode = true;
    this.category = category;
    this.imgURL = null;
    this.uploadFile = null;

    category.imagePath.subscribe((url) => {
      this.downloadUrl = url;
    });

    // SET FORM
    this.createCategoryForm = new FormGroup({
      name: new FormControl(category.name, Validators.required),
      hasCategories: new FormControl(
        category.hasCategories,
        Validators.required
      ),
      hasFood: new FormControl(category.hasFood, Validators.required),
      imagePath: new FormControl(null),
    });
    this.editImage = category.imagePath;
    this.id = category.id;
  }

  ngOnDestroy() {
    // DESTROY SUBS
    this.editModeSub.unsubscribe();
  }
}
