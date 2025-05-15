import { Component } from '@angular/core';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: false,
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
    dashboardData: any;

      constructor(private adminService: AdminService) {}

      ngOnInit(): void {
        this.getDashboardOverview();
      }

      getDashboardOverview(): void {
        this.adminService.getDashboardOverview().subscribe(data => {
          this.dashboardData = data;
        });
      }
}


