export class Item {
  public name: string;
  public description: string;
  public price: number;
  public imagePath: string;
  public isVisible: boolean;
  public id: string;

  constructor(
    name: string,
    description: string,
    price: number,
    imagePath: string,
    isVisible: boolean,
    id: string
  ) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.imagePath = imagePath;
    this.isVisible = isVisible;
    this.id = id;
  }
}
