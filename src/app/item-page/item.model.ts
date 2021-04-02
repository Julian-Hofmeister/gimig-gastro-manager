import { Observable } from 'rxjs';

export class Item {
  public name: string;
  public description: string;
  public price: number;
  public imagePath: Observable<any>;
  public isVisible: boolean;
  public isFood: boolean;
  public id: string;
  public parentId: string;

  constructor(
    name: string,
    description: string,
    price: number,
    imagePath: Observable<any>,
    isVisible: boolean,
    isFood: boolean,
    id: string,
    parentId: string
  ) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.imagePath = imagePath;
    this.isVisible = isVisible;
    this.isFood = isFood;
    this.id = id;
    this.parentId = parentId;
  }
}
