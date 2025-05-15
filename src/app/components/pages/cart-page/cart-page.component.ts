import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../services/cart.service';
import { Cart } from '../../../shared/models/Cart';
import { CartItem } from '../../../shared/models/CartItem';
import { Food } from '../../../shared/models/Food';
@Component({
    selector: 'app-cart-page',
    templateUrl: './cart-page.component.html',
    styleUrls: ['./cart-page.component.css'],
    standalone: false
})
export class CartPageComponent implements OnInit {

  foods:any[] = [];
  cart!: Cart;
  constructor(private cartService: CartService) {
    this.cartService.getCartObservable().subscribe((cart) => {
      this.cart = cart;
      
    })
   }

  getImageUrl(imageFileName: string): string {
  const isFullUrl = imageFileName.startsWith('http') || imageFileName.startsWith('https');
  const backendUrl = isFullUrl ? '' : (window.location.hostname === 'localhost' 
      ? 'https://puff-sip.onrender.com' 
      : 'http://localhost:5000');

  return isFullUrl ? imageFileName : `${backendUrl}/${imageFileName.replace(/^assets\//, '')}`;
}
 

  ngOnInit(): void {
  }



  removeFromCart(cartItem:CartItem){
    this.cartService.removeFromCart(cartItem.food._id);
  }

  changeQuantity(cartItem:CartItem,quantityInString:string){
    const quantity = parseInt(quantityInString);
    this.cartService.changeQuantity(cartItem.food._id, quantity);
  }

}