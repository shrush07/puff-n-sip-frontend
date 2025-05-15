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
    this.getTopSellingProducts();
  }

  getTopSellingProducts(): void {
    this.adminService.getTopSellingProducts(this.selectedRange).subscribe(data => {
    this.topProducts = data;
    });
  }

  fetchTopProducts(range: 'weekly' | 'monthly' | 'yearly') {
  console.log('Fetching top products for:', range);
}
}
