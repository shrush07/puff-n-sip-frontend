import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TopProduct } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  // Set base URL once for all admin routes
  private baseUrl = 'https://puff-sip.onrender.com/api/admin'; 

  constructor(private http: HttpClient) {}

  // Get top-selling products
  getTopSellingProducts(range: 'weekly' | 'monthly' | 'yearly'): Observable<TopProduct[]> {
  return this.http.get<TopProduct[]>(`/api/admin/top-products?range=${range}`);
  }

  // Get user order history
  getUserOrderHistory(userId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/users/${userId}/orders`);
  }

  // Get user details
  getUserDetails(userId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/users/${userId}`);
  }

  // Get revenue reports
  getRevenueReports(range: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/revenue?range=${range}`);
  }

  // Get dashboard overview
  getDashboardOverview(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/overview`);
  }
}
