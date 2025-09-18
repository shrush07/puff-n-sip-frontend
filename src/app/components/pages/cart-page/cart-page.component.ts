import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../../services/cart.service';
import { UserService } from '../../../services/user.service';
import { Cart } from '../../../shared/models/Cart';
import { CartItem } from '../../../shared/models/CartItem';

@Component({ 
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css'],
  standalone: false
})
export class CartPageComponent implements OnInit {

  cart!: Cart;

  constructor(
    private cartService: CartService,
    private router: Router,
    private userService: UserService
  ) {
    this.cartService.getCartObservable().subscribe((cart) => {
      this.cart = cart;
    });
  }

  ngOnInit(): void {}

  // Navigate to checkout, or redirect to login if not logged in
  goToCheckout(): void {
    // Use getValidCurrentUser to ensure token is valid
    const user = this.userService.getValidCurrentUser();
    if (!user) {
      // Redirect to login with returnUrl if no valid user
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/checkout' } });
      return;
    }
    // Proceed to checkout if logged in
    this.router.navigate(['/checkout']);
  }

  removeFromCart(cartItem: CartItem): void {
    this.cartService.removeFromCart(cartItem.food._id);
  }

  changeQuantity(cartItem: CartItem, quantityInString: string): void {
    const quantity = parseInt(quantityInString);
    this.cartService.changeQuantity(cartItem.food._id, quantity);
  }

  getImageUrl(imageFileName: string): string {
    const isFullUrl = imageFileName.startsWith('http') || imageFileName.startsWith('https');
    const backendUrl = isFullUrl ? '' : (window.location.hostname === 'localhost' 
      ? 'https://puff-sip.onrender.com' 
      : 'http://localhost:5000');
    return isFullUrl ? imageFileName : `${backendUrl}/${imageFileName.replace(/^assets\//, '')}`;
  }
}
