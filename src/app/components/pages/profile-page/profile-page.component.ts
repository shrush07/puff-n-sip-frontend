import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { User } from '../../../shared/models/User';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css'],
})
export class ProfilePageComponent implements OnInit {
  user!: User;

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Load instantly from BehaviorSubject / localStorage
    this.userService.userObservable.subscribe(user => {
      this.user = user;
    });

    this.userService.getUserProfile().subscribe();


    // Optional: refresh from backend
    this.userService.getUserProfile().subscribe({
      next: (data) => (this.user = data),
      error: (err) => console.error('Failed to fetch profile', err),
    });

    // Subscribe to updates (after settings edit)
    this.userService.userObservable.subscribe((updatedUser) => {
      this.user = updatedUser;
    });
  }

  goToSettings() {
    this.router.navigate(['/settings']); // navigate to settings page
  }

  
}