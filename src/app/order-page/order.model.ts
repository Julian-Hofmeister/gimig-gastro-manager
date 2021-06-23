import { Observable } from 'rxjs';

export class Order {
  constructor(
    public amount: number,
    public description: string,
    public id: string,
    public imagePath: Observable<any>,

    public isAccepted: boolean,
    public isFood: boolean,
    public isOrdered: boolean,
    public isPaid: boolean,
    public isServed: boolean,
    public isVisible: boolean,

    public name: string,
    public parentId: string,
    public price: number,

    public tableNumber: number,
    public timestamp: number
  ) {}
}
