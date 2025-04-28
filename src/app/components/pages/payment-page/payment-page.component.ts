import { Component, OnInit,  AfterViewInit } from '@angular/core';
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
import { environment } from '../../../../../../backend/src/enviornments/environment';
import { ORDER_PAY_URL } from '../../../shared/constants/urls';

@Component({
    selector: 'app-payment-page',
    templateUrl: './payment-page.component.html',
    styleUrls: ['./payment-page.component.css'],
    standalone: false
})
export class PaymentPageComponent implements OnInit,  AfterViewInit {
  order: Order = new Order();
  checkoutForm!: FormGroup;
  cart: any;
  clientSecret: string | null = null;
  console: any;

  constructor(
    private cartService: CartService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private toastrService: ToastrService,
    private orderService: OrderService,
    private http: HttpClient,
    private router: Router,
    private stripeService: StripeService 
    
  ) {}

  async ngOnInit(): Promise<void> {
    // Initialize cart and order information
    const cart = this.cartService.getCart();
    console.log('Cart:', cart);
    
    this.order.items = cart?.items || [];
    this.order.totalPrice = cart?.totalPrice || 0;

    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { order: Order };

    if (state?.order) {
      this.order = state.order;
      console.log('Order received on payment page:', this.order);
    } else {
      console.error('Order information missing. Fetching latest order from server...');
      await this.fetchLatestOrder();
    }

    console.log('Final Order:', this.order);
    this.order.imageUrl = this.getOrderImageUrl(); // Example method to get image URL
  
    // Initialize Stripe
    await this.setupStripe();
  }

  async fetchLatestOrder(): Promise<void> {
    try {
      const latestOrder = await this.orderService.getLatestOrder().toPromise();
      if (latestOrder) {
        this.order = latestOrder;
        console.log('Fetched latest order:', this.order);
      } else {
        console.warn('No recent orders found.');
        throw new Error('No recent orders found.');
      }
    } catch (error) {
      console.error('Failed to fetch latest order:', error);
      if (error) {
        this.toastrService.warning('No recent orders found. Redirecting to checkout.');
      } else {
        this.toastrService.error('Unable to retrieve order details. Redirecting to checkout.');
      }
      this.router.navigate(['/checkout']);
    }
  }
  
  
  

  get fc() {
    return this.checkoutForm.controls;
  }

  ngAfterViewInit(): void {}

  async setupStripe() {
    try {
      await this.stripeService.initializeStripe();  // Ensure Stripe is initialized
    } catch (error) {
      console.error('Error initializing Stripe:', error);
      this.toastrService.error('Stripe initialization failed');
    }
  }

  // Create payment intent and handle errors
  async createPaymentIntent(): Promise<void> {
    const payload = { items: this.order.items, totalAmount: this.order.totalPrice };
    try {
      const response = await this.http
        .post<{ clientSecret: string }>('/api/orders/payment/create-payment-intent', payload)
        .toPromise();

        console.log('Response from create-payment-intent::', response);  // Check the response

      if (response?.clientSecret) {
        this.clientSecret = response.clientSecret;
        console.log('Client Secret:', this.clientSecret); 
      } else {
        throw new Error('Client secret not received');
      }
    } catch (error) {
      console.error('Error creating payment intent:', error);
      this.toastrService.error('Failed to create payment intent or invalid client secret');
    }
  }
  
  // Handle the payment using the client secret
  async handlePayment(): Promise<void> {
    console.log('Submit Payment Button Clicked');
  
    try {  
      await this.createPaymentIntent(); // Create payment intent

      // Check if clientSecret was successfully set
      if (!this.clientSecret) {
        throw new Error('Client secret is invalid or empty');
      }
      console.log('Confirming payment with client secret:', this.clientSecret);

      const paymentIntent = await this.stripeService.confirmCardPayment(this.clientSecret);
      
      console.log('Payment successful:', paymentIntent);
      // Handle successful payment
      this.toastrService.success('Payment succeeded');
      this.paymentSuccess(paymentIntent);
    } catch (error) {
      // Handle errors during payment
      console.error('Payment error:', error);
      this.toastrService.error('Payment failed');
    }
  }
  
  // Handle success after payment confirmation
  paymentSuccess(paymentIntent: any): void {
    console.log('Payment Intent:', paymentIntent); // Debugging log
    console.log('Order ID:', this.order._id); // Debugging log

    const payload = { orderId: this.order._id, paymentId: paymentIntent.id };
    
    if (!payload.orderId || !payload.paymentId) {
      console.error('Invalid payload:', payload);
      this.toastrService.error('Invalid order or payment information.');
      return;
    }

    this.http.post('/api/orders/payment/success', payload).subscribe(
      () => {
        this.toastrService.success('Payment successful Redirecting...');
        this.router.navigate(['/order-success']);
      },
      (error) => {
        console.error('Order submission failed:', error);
        this.toastrService.error('Payment success but order failed');
      }
    );
  }

  // Placeholder for the order image URL
  private getOrderImageUrl(): string {
    // Placeholder for a method that returns a valid image URL
    return 'http://localhost:4200/order-image.jpg';
  }
}
