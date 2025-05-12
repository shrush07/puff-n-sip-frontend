import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { ORDER_CREATE_URL, ORDER_NEW_FOR_CURRENT_USER_URL, ORDER_UPDATE_URL, ORDER_PAY_URL, ORDER_TRACK_URL, ORDER_BY_ID_URL, ORDER_LATEST_URL } from '../shared/constants/urls';
import { Order } from '../shared/models/Order';
import { catchError } from 'rxjs/operators';
import { UserService } from './user.service';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private http: HttpClient, private userService: UserService) {}

  // Function to check if token is expired
  private isTokenExpired(token: string): boolean {
    const decodedToken: any = jwtDecode(token); 
    const currentTime = Math.floor(Date.now() / 1000); 
    return decodedToken.exp < currentTime; 
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.userService.getToken();
    if (!token || this.isTokenExpired(token)) {
      throw new Error("Invalid or expired token");
    }

    return new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    });
  }

  create(order: Order): Observable<Order> {
    const token = this.userService.getToken();
    const headers = this.getAuthHeaders(); 
    // const headers = new HttpHeaders({
    //   'Authorization': `Bearer ${token}`,
    //   'Content-Type': 'application/json'
    // });
    console.log('Token being sent:', token);

    if (!token || this.isTokenExpired(token)) {
      console.error('Token is invalid or expired before order creation');
      return throwError(() => new Error('Invalid or expired token'));
    }
    
    console.log('Order payload:', order);
    
    if (!order.name || !order.address || !order.items || order.items.length === 0 || !order.orderType) {
      console.error('Validation failed: Missing required fields', { order });
      return throwError(() => new Error('All fields are required, including orderType'));
    }

    return this.http.post<Order>(ORDER_CREATE_URL, order, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('HTTP Error:', error.message, error);
        if (error.status === 400) {
          return throwError(() => new Error('Validation failed: Check order fields.'));
        }
        return throwError(() => error);
      })
    );
  }

  getNewOrderForCurrentUser(): Observable<Order> {
    const headers = this.getAuthHeaders();
    const token = this.userService.getToken(); 
    console.log('Retrieved token:', token);
    console.log('Making API call to /api/orders/newOrderForCurrentUser');

    if (!token || this.isTokenExpired(token)) {
      return throwError(() => new Error('Invalid or expired token'));
    }

    // const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    
    return this.http.get<Order>(ORDER_NEW_FOR_CURRENT_USER_URL, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error creating order:', error);
        // Don't logout automatically
        return throwError(() => error); // Return the actual error
      })
    );
  }

  getOrderById(orderId: string): Observable<Order> {
    const headers = this.getAuthHeaders();
    console.log("orderid:",orderId);
    return this.http.get<Order>(`${ORDER_BY_ID_URL}/${orderId}`, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error("Error fetching order:", error);
        return throwError(() => error);
      })
    );
  }
  
  // updateOrder(orderId: string, orderData: Order): Observable<Order> {
  //   const token = this.userService.getToken();
  //   const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
  
  //   return this.http.put<Order>(`${ORDER_UPDATE_URL}/${orderId}`, orderData, { headers }).pipe(
  //     catchError((error: HttpErrorResponse) => {
  //       console.error('Error updating order:', error);
  //       return throwError(() => error);
  //     })
  //   );
  // }
  
  getLatestOrder(): Observable<Order> {
    return this.http.get<Order>(ORDER_LATEST_URL).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching latest order:', error);
        return throwError(() => error);
      })
    );
  }

  pay(paymentId: string): Observable<{ message: string; orderId: string }> {
    const headers = this.getAuthHeaders();
    return this.http
      .post<{ message: string; orderId: string }>(ORDER_PAY_URL, { paymentId }, { headers })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error("Error processing payment:", error);
          return throwError(() => error);
        })
      );
  }
  
  trackOrderById(orderId: string): Observable<Order> {
    const headers = this.getAuthHeaders();
    return this.http.get<Order>(`${ORDER_TRACK_URL}/${orderId}`, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error("Error tracking order:", error);
        return throwError(() => error);
      })
    );
  }
}