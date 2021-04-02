import { Observable } from 'rxjs';

export class Category {
  public name: string;
  public hasCategories: boolean;
  public hasFood: boolean;
  public imagePath: Observable<any>;
  public isVisible: boolean;
  public id: string;
  public parentId: string;

  constructor(
    name: string,
    hasCategories: boolean,
    hasFood: boolean,
    imagePath: Observable<any>,
    isVisible: boolean,
    id: string,
    parentId: string
  ) {
    this.name = name;
    this.hasCategories = hasCategories;
    this.hasFood = hasFood;
    this.imagePath = imagePath;
    this.isVisible = isVisible;
    this.id = id;
    this.parentId = parentId;
  }
}
