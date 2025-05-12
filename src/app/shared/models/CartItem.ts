import { Food } from "./Food";

export class CartItem {
    _id: any;
    name!: string;
    constructor(food: Food) {
      this.food = JSON.parse(JSON.stringify(food)); // Deep copy
      this.price = this.food.price;
      this.quantity = 1;
    }
    food: Food;
    price: number;
    quantity: number;
  }