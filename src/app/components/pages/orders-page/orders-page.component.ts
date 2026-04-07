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

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.getUserOrders().subscribe({
      next: (data) => {
        console.log('Orders from API:', data);
        this.orders = data;
      },
      error: (err) => console.error('Error:', err),
    });
  }
}