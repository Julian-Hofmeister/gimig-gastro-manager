import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from '../category.model';
import { CategoryService } from '../category.service';

@Component({
  selector: 'app-category-item',
  templateUrl: './category-item.component.html',
  styleUrls: ['./category-item.component.css'],
})
export class CategoryItemComponent implements OnInit {
  @Input() category: Category;
  @Input() index: number;

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {}

  onDeleteCategory() {
    this.categoryService.deleteCategory(this.index);
  }

  onChangeVisibility() {
    this.categoryService.changeCategoryVisibilty(this.category);
  }

  onOpenContent() {
    if (this.category.hasCategories) {
      this.router.navigate([this.category.name.toLowerCase() + '/category'], {
        relativeTo: this.route,
      });
    } else {
      this.router.navigate([this.category.name.toLowerCase() + '/items'], {
        relativeTo: this.route,
      });
    }
  }

  onEditCategory() {
    this.categoryService.editCategory(this.category, this.index);
  }
}
