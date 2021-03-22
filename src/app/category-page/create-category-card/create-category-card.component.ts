import { Component, OnInit } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { DataStorageService } from 'src/app/category-page/data-storage.service';
import { Category } from '../category.model';
import { CategoryService } from '../category.service';

@Component({
  selector: 'app-create-category-card',
  templateUrl: './create-category-card.component.html',
  styleUrls: ['./create-category-card.component.css'],
})
export class CreateCategoryCardComponent implements OnInit {
  createCategoryForm: FormGroup;
  fileText = 'Kategorie Bild auswählen';
  category: Category;
  selectedFile = null;
  imagePath: any;
  imgURL: any;
  id: string;

  editModeSub: Subscription;
  isEditMode = false;

  constructor(
    private categoryService: CategoryService,
    private dataStorageService: DataStorageService,
    public afs: AngularFirestore
  ) {}

  ngOnInit() {
    // INIT FORM
    this.createCategoryForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      hasCategories: new FormControl(false, Validators.required),
      hasFood: new FormControl(true, Validators.required),
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

  // CREATE NEW CATEGORY
  onSubmit() {
    // LOG FORM
    console.log(this.createCategoryForm);

    // DEFINE VALUES
    const name = this.createCategoryForm.value.name;
    const hasCategories = this.createCategoryForm.value.hasCategories;
    const hasFood = this.createCategoryForm.value.hasFood;
    const imagePath = this.imgURL;
    const isVisible = true;

    this.category = new Category(
      name,
      hasCategories,
      hasFood,
      imagePath,
      isVisible,
      this.id
    );

    // TAKE ACTION
    if (!this.isEditMode) {
      // CREATE CATEGORY
      this.dataStorageService.addCategory(
        this.category,
        this.dataStorageService.path
      );
    } else {
      // UPDATE CATEGORY
      this.dataStorageService.updateCategory(
        this.category,
        this.dataStorageService.path
      );
      // RESET EDIT MODE
      this.isEditMode = false;
    }

    //RESET FORM
    this.imgURL = '';
    this.fileText = 'Bild auswählen';
    this.createCategoryForm.reset();
  }

  onEditMode(category: Category) {
    this.isEditMode = true;

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
    this.imgURL = category.imagePath;
    this.fileText = category.imagePath;
    this.id = category.id;
  }
}
