export class Item {
  public name: string;
  public description: string;
  public price: number;
  public imagePath: string;
  public isVisible: boolean;

  constructor(
    name: string,
    description: string,
    price: number,
    imagePath: string,
    isVisible: boolean
  ) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.imagePath = imagePath;
    this.isVisible = isVisible;
  }
}
