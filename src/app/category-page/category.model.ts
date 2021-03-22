export class Category {
  public name: string;
  public hasCategories: boolean;
  public hasFood: boolean;
  public imagePath: string;
  public isVisible: boolean;
  public id: string;

  constructor(
    name: string,
    hasCategories: boolean,
    hasFood: boolean,
    imagePath: string,
    isVisible: boolean,
    id: string
  ) {
    this.name = name;
    this.hasCategories = hasCategories;
    this.hasFood = hasFood;
    this.imagePath = imagePath;
    this.isVisible = isVisible;
    this.id = id;
  }
}
