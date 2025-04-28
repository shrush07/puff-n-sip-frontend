import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Order } from '../../../shared/models/Order';
import { CartService } from '../../../services/cart.service';
import { UserService } from '../../../services/user.service';
import { OrderService } from '../../../services/order.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Cart } from '../../../shared/models/Cart';
import { jwtDecode } from 'jwt-decode';
import { StripeService } from '../../../services/stripe.service';
import { environment } from '../../../../enviornments/environment';

@Component({
    selector: 'app-checkout-page',
    templateUrl: './checkout-page.component.html',
    styleUrls: ['./checkout-page.component.css'],
    standalone: false
})
export class CheckoutPageComponent implements OnInit {
  order: Order = new Order();
  checkoutForm!: FormGroup;

  constructor(
    private cartService: CartService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private toastrService: ToastrService,
    private orderService: OrderService,
    private router: Router,
  ) {  }

  ngOnInit(): void {
    console.log('Checkout page initialized');
    const token = this.userService.getToken();
    console.log('Current token:', token);
    if (!token) {
      console.warn('No token available, redirecting to login');
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: '/checkout' },
      });
      return;
    }

    const cart = this.cartService.getCart();
    console.log('Cart:', cart);

    this.order.items = cart?.items || [];
    this.order.totalPrice = cart?.totalPrice || 0;
    this.order.imageUrl = this.getOrderImageUrl(); 

    const { name, address } = this.userService.currentUser;
    this.checkoutForm = this.formBuilder.group({
      name: [name || '', Validators.required],
      address: [address || '', Validators.required],
    });
  }

  get fc() {
    return this.checkoutForm.controls;
  }

  createOrder(): void {
    if (!this.userService.isLoggedIn()) {
      this.toastrService.error('You need to log in to place an order.');
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: '/order' },
      });
      return;
    }

    if (this.checkoutForm.invalid) {
      this.toastrService.warning('Please fill all required fields');
      return;
    }

    this.order.name = this.fc.name.value;
    this.order.address = this.fc.address.value;

    this.orderService.create(this.order).subscribe({
      next: (createdOrder) => {
        this.toastrService.success('Order created successfully');
        this.router.navigate(['/payment-page'], { state: { order: createdOrder } }); // Pass order to payment page
      },
      error: (error: HttpErrorResponse) => {
        this.toastrService.error(error.error.message || 'Failed to create order.');
      },
    });
       
  }

  private getOrderImageUrl(): string {
    // Placeholder for a method that returns a valid image URL
    return 'http://localhost:4200/order-image.jpg';
  }
}
