import { Component, OnInit } from '@angular/core';
import { AdminService } from '../services/admin.service';
import { TopProduct } from '../models/product.model';

@Component({
  selector: 'app-top-selling-products',
  templateUrl: './top-selling-products.component.html',
  styleUrls: ['./top-selling-products.component.css'],
  standalone: false
})
export class TopSellingProductsComponent implements OnInit {

  topProducts: TopProduct[] = [];
  selectedRange: 'weekly' | 'monthly' | 'yearly' = 'weekly';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.fetchTopProducts(this.selectedRange);
  }

  // ✅ Fetches top products from backend
  fetchTopProducts(range: 'weekly' | 'monthly' | 'yearly'): void {
    this.selectedRange = range;
    console.log('Fetching top products for:', range);
    this.adminService.getTopSellingProducts(range).subscribe({
      next: (data) => {
        this.topProducts = data;
        console.log('Top products:', data);
      },
      error: (err) => {
        console.error('Error fetching top products:', err);
      }
    });
  }
}
