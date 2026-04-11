import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { OrderService } from '../../../services/order.service';
import { Order } from '../../../shared/models/Order';

@Component({
  selector: 'app-orders-page',
  standalone: true,
  imports: [CommonModule],
  providers: [DatePipe], // needed for date pipe
  templateUrl: './orders-page.component.html',
  styleUrls: ['./orders-page.component.css'],
})
export class OrdersPageComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];

  // Default filter = COMPLETED
  selectedStatus: string = 'COMPLETED';

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.getUserOrders().subscribe({
      next: (data) => {
        console.log('Orders from API:', data);
        this.orders = data;

        // Apply default filter
        this.applyFilter();
      },
      error: (err) => console.error('Error:', err),
    });
  }

  // Filter logic
  applyFilter() {
    if (this.selectedStatus === 'ALL') {
      this.filteredOrders = this.orders;
    } else {
      this.filteredOrders = this.orders.filter(
        order => order.status === this.selectedStatus
      );
    }
  }

  // Change filter
  onFilterChange(status: string) {
    this.selectedStatus = status;
    this.applyFilter();
  }

  // Convert backend status → user friendly label
  getDisplayStatus(status: string): string {
    return status === 'NEW' ? 'Uncompleted' : status;
  }
}