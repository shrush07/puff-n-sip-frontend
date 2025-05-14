import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css'],
  standalone: false
})
export class UserDetailsComponent implements OnInit {
  userId: string = '';
  userDetails: any;

  constructor(
    private adminService: AdminService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('userId') || '';
    this.getUserDetails();
  }

  getUserDetails(): void {
    if (this.userId) {
      this.adminService.getUserDetails(this.userId).subscribe(data => {
        this.userDetails = data;
      });
    }
  }
}
