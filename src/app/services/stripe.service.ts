import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loadStripe, Stripe, StripeCardElement, StripeElements } from '@stripe/stripe-js';
import { environment } from '../../environments/environments';
@Injectable({ providedIn: 'root' })
export class StripeService {

  private stripe: Stripe | null = null;
  private elements: StripeElements | null = null;
  private card: StripeCardElement | null = null;

  constructor(private http: HttpClient) {}

  async initializeStripe(): Promise<void> {
    if (this.stripe) return;

    this.stripe = await loadStripe(environment.stripePublicKey);

    if (!this.stripe) throw new Error('Stripe failed to load');

    this.elements = this.stripe.elements();

    this.card = this.elements.create('card');
    this.card.mount('#card-element');
  }

  getStripe(): Stripe {
    if (!this.stripe) throw new Error('Stripe not initialized');
    return this.stripe;
  }

  getCard(): StripeCardElement {
    if (!this.card) throw new Error('Card not initialized');
    return this.card;
  }

  createPaymentIntent(amount: number) {
    return this.http.post<{ clientSecret: string }>(
      `${environment.apiUrl}/create-payment-intent`,
      { amount }
    );
  }

  async confirmPayment(clientSecret: string) {
    if (!this.stripe || !this.card) {
      throw new Error('Stripe not initialized');
    }

    const { error, paymentIntent } = await this.stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: { card: this.card }
      }
    );

    if (error) throw new Error(error.message);

    return paymentIntent;
  }
}