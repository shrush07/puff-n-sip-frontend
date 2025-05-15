import { Component, OnInit } from '@angular/core';
import { AdminService } from '../services/admin.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-order-history',
  templateUrl: './user-order-history.component.html',
  styleUrls: ['./user-order-history.component.css'],
  standalone: false
})
export class UserOrderHistoryComponent implements OnInit {
  userId: string = '';
  orderHistory: any[] = [];

  constructor(
    private adminService: AdminService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('userId') || '';
    this.getUserOrderHistory();
  }

  getUserOrderHistory(): void {
    if (this.userId) {
      this.adminService.getUserOrderHistory(this.userId).subscribe(data => {
        this.orderHistory = data;
      });
    }
  }
}
