import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cart } from '../shared/models/Cart';
import { CartItem } from '../shared/models/CartItem';
import { Food } from '../shared/models/Food';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ORDER_ADD_CART_URL } from '../shared/constants/urls';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart: Cart = this.getCartFromLocalStorage();
  private cartSubject: BehaviorSubject<Cart> = new BehaviorSubject(this.cart);
  constructor(private http: HttpClient) {}
  
  addToCart(food: Food): Observable<void> {
    console.log('Adding product to cart:', JSON.stringify(food, null, 2));
    console.log('Current cart items:', JSON.stringify(this.cart.items, null, 2));

    if (!food) {
      console.error('Food object is required to add to cart.');
      throw new Error('Food object is missing');
    }

    let cartItem = this.cart.items.find((item) => this.isSameFood(item.food, food));

    if (cartItem) {
      console.log('Item found in cart, updating quantity');
      cartItem.quantity += 1;
      cartItem.price = cartItem.quantity * cartItem.food.price;
    } else {
      console.log('Item not found in cart, adding new item');
      let newItem = new CartItem(food);
      this.cart.items.push(newItem);
      console.log('New item added:', JSON.stringify(newItem, null, 2));
    }

    console.log('Updated cart items:', JSON.stringify(this.cart.items, null, 2));
    this.setCartToLocalStorage();
    return this.http.post<void>(ORDER_ADD_CART_URL, { foodId: food._id });
  }

  private isSameFood(food1: Food, food2: Food): boolean {
    return (
      food1._id === food2._id &&
      food1.name === food2.name &&
      food1.price === food2.price
    );
  }

  removeFromCart(foodId: string): void {
    console.log('Current cart items:', JSON.stringify(this.cart.items, null, 2));
  
    let itemRemoved = false;
    const newCartItems = [];
  
    for (let i = 0; i < this.cart.items.length; i++) {
      const item = this.cart.items[i];
      console.log(`Checking item ${i}:`, JSON.stringify(item, null, 2));
      
      if (item.food._id === foodId && !itemRemoved) {
        itemRemoved = true;
      } else {
        newCartItems.push(item);
      }
    }
  
    this.cart.items = newCartItems;
    console.log('Updated cart items:', JSON.stringify(this.cart.items, null, 2));
  
    this.setCartToLocalStorage();
  }

  changeQuantity(foodId: string, quantity: number): void {
    let cartItem = this.cart.items.find((item) => item.food._id === foodId);
    if (!cartItem) return;

    cartItem.quantity = quantity;
    cartItem.price = quantity * cartItem.food.price;
    this.setCartToLocalStorage();
  }

  clearCart() {
    localStorage.removeItem('Cart');
    this.cart = new Cart(); 
    this.cartSubject.next(this.cart);
  }

  getCartObservable(): Observable<Cart> {
    return this.cartSubject.asObservable();
  }

  getCart(): Cart {
    return this.cartSubject.value;
  }

  private setCartToLocalStorage(): void {
    this.cart.totalPrice = this.cart.items.reduce(
      (prevSum, currentItem) => prevSum + currentItem.price,
      0
    );
    this.cart.totalCount = this.cart.items.reduce(
      (prevSum, currentItem) => prevSum + currentItem.quantity,
      0
    );
  
    const cartJson = JSON.stringify(this.cart);
    localStorage.setItem('Cart', cartJson);
    this.cartSubject.next(this.cart);
    console.log('Cart updated:', JSON.stringify(this.cart, null, 2));
  }

  private getCartFromLocalStorage(): Cart {
    const cartJson = localStorage.getItem('Cart');
    if (cartJson) {
      let cart: Cart = JSON.parse(cartJson);
      cart.items = cart.items.map((item) => {
        let cartItem = new CartItem(item.food);
        cartItem.quantity = item.quantity;
        cartItem.price = item.price;
        return cartItem;
      });
      return cart;
    }
    return new Cart();
  }
  
  updateCart(cart: Cart): void {
    this.cartSubject.next(cart);
  }
  
}