import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-top-selling-products',
  templateUrl: './top-selling-products.component.html',
  styleUrls: ['./top-selling-products.component.css'],
  standalone: false
})
export class TopSellingProductsComponent implements OnInit {
  topProducts: any[] = [];
  selectedRange: string = 'monthly'; // Default range

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.getTopSellingProducts();
  }

  getTopSellingProducts(): void {
    this.adminService.getTopSellingProducts(this.selectedRange).subscribe(data => {
      this.topProducts = data;
    });
  }

  onRangeChange(range: string): void {
    this.selectedRange = range;
    this.getTopSellingProducts();
  }
}
