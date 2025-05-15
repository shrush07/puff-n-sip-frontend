import { Component, OnInit } from '@angular/core';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-revenue-reports',
  templateUrl: './revenue-reports.component.html',
  styleUrls: ['./revenue-reports.component.css'],
  standalone: false
})
export class RevenueReportsComponent implements OnInit {
  revenueData: any;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.getRevenueReports('daily'); // Default range
  }

  getRevenueReports(range: string): void {
    this.adminService.getRevenueReports(range).subscribe(data => {
      this.revenueData = data;
    });
  }
}
