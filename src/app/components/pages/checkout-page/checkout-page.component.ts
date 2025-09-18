import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Order } from '../../../shared/models/Order';
import { CartService } from '../../../services/cart.service';
import { UserService } from '../../../services/user.service';
import { OrderService } from '../../../services/order.service';
import { HttpErrorResponse } from '@angular/common/http';

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
  ) { }

  ngOnInit(): void {
    console.log('Checkout page initialized');

    // Get the current user safely
    const user = this.userService.getValidCurrentUser();
    if (!user) {
      // If no valid user or token, redirect to login with returnUrl
      console.warn('No valid user or token, redirecting to login');
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/checkout' } });
      return;
    }

    // Get current cart
    const cart = this.cartService.getCart();
    console.log('Cart:', cart);

    this.order.items = cart?.items || [];
    this.order.totalPrice = cart?.totalPrice || 0;
    this.order.imageUrl = this.getImageUrl('default.jpg'); // Default image

    // Initialize checkout form with user info
    const { name, address } = user;
    this.checkoutForm = this.formBuilder.group({
      name: [name || '', Validators.required],
      address: [address || '', Validators.required],
    });
  }

  get fc() {
    return this.checkoutForm.controls;
  }

  createOrder(): void {
    // Check login and token validity before creating order
    const user = this.userService.getValidCurrentUser();
    if (!user) {
      this.toastrService.error('You need to log in to place an order.');
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/checkout' } });
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
        this.toastrService.error(error.error?.message || 'Failed to create order.');
      },
    });
  }

  getImageUrl(imageFileName: string): string {
    // Check if the imageFileName is already a full URL
    if (imageFileName.startsWith('http://') || imageFileName.startsWith('https://')) {
      return imageFileName;
    }

    // Determine the backend URL based on the environment
    const backendUrl = window.location.hostname === 'localhost' 
      ? 'https://puff-sip.onrender.com' 
      : 'http://localhost:5000';

    // Clean the imageFileName by removing any leading paths
    const cleanedFileName = imageFileName.replace(/^assets\/images\//, '').replace(/^assets\//, '');

    // Construct and return the full image URL
    return `${backendUrl}/${cleanedFileName}`;
  }
}
