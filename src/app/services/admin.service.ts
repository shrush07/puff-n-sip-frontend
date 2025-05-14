import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) {}

  // Get top-selling products
  getTopSellingProducts(range: string): Observable<any> {
    return this.http.get<any>(`/api/admin/top-products?range=${range}`);
  }

  // Get user order history
  getUserOrderHistory(userId: string): Observable<any> {
    return this.http.get<any>(`/api/admin/users/${userId}/orders`);
  }

  // Get user details
  getUserDetails(userId: string): Observable<any> {
    return this.http.get<any>(`/api/admin/users/${userId}`);
  }

  // Get revenue reports
  getRevenueReports(range: string): Observable<any> {
    return this.http.get<any>(`/api/admin/revenue?range=${range}`);
  }

  // Get dashboard overview
  getDashboardOverview(): Observable<any> {
    return this.http.get<any>('/api/admin/overview');
  }
}
