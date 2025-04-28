import { Injectable } from '@angular/core';
import { loadStripe, Stripe, StripeCardElement, StripeElements  } from '@stripe/stripe-js';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../enviornments/environment';
import { ORDER_PAY_URL } from '../shared/constants/urls';

// Preloading Stripe using environment variable for the public key
const stripePromise = loadStripe(environment.stripePublicKey);

@Injectable({
  providedIn: 'root'
})

export class StripeService {

  private stripe: any;
  private elements: StripeElements | null = null;
  private card: StripeCardElement | null = null;

  constructor(private http: HttpClient) {
    // this.initializeStripe();
  }

  //Initializes Stripe and creates card elements 
  async initializeStripe(): Promise<void> {
    if (this.stripe) {
      console.log('Stripe already initialized');
      return; 
    }
  
    // Load Stripe and initialize elements
    try {
      this.stripe = await stripePromise;
      if (!this.stripe) {
        throw new Error('Failed to load Stripe');
      }
  
      this.elements = this.stripe.elements();
      if (!this.elements) {
        throw new Error('Failed to initialize Stripe Elements');
      }
  
      this.card = this.elements.create('card');
      if (!this.card) {
        throw new Error('Failed to create card element');
      }
  
      this.card.mount('#card-element'); // Ensure there's only one element with this ID
      console.log('Stripe initialized and card element mounted');
    } catch (error) {
      console.error('Error initializing Stripe:', error);
      throw error;  // Rethrow the error after logging
    }
  }
  
  
  getStripe() {
    return this.stripe;
  }

  // Returns the initialized Stripe instance
  getStripeInstance(): Stripe {
    if (!this.stripe) throw new Error('Stripe is not initialized');
    return this.stripe;
  }

  //Returns the initialized card element
  getCardElement(): StripeCardElement {
    if (!this.card) throw new Error('Card element is not initialized');
    return this.card;
  }

  //Creates a payment intent by sending the amount to the backend
  createPaymentIntent(amount: number) {
    console.log('payment intent called in stripe service');
    return this.http.post<{ clientSecret: string }>(`${ORDER_PAY_URL}/create-payment-intent`, { amount });
  }

  //Confirms the payment using the provided clientSecret
  async confirmCardPayment(clientSecret: string): Promise<any> {
    if (!this.stripe || !this.card) {
      throw new Error('Stripe or Card element is not initialized');
    }
  
    const { error, paymentIntent } = await this.stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: this.card,
      },
    });
  
    if (error) {
      console.error('Payment failed:', error);
      throw new Error(`Payment failed: ${error.message}`);
    }
  
    return paymentIntent;
  }

  handlePaymentError(error: any): void {
    console.error('Stripe Payment Error:', error);
  }
}