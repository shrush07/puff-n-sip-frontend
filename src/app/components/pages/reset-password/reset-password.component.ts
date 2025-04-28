import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.css'],
    standalone: false
})
export class ResetPasswordComponent implements OnInit{
  email: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  token: string | null = null;
  message: string = '';
  isRequestingReset: boolean = true;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService // Inject ToastrService

  ) {}
  ngOnInit() {
    this.token = this.route.snapshot.paramMap.get('token');
    if (this.token) {
      this.isRequestingReset = false;
    } else {
      this.isRequestingReset = true;
    }
  }

  onSubmitRequest() {
    console.log('Requesting password reset for:', this.email);
    this.userService.requestPasswordReset(this.email).subscribe(
      response => {
        console.log('Password reset requested successfully');
        this.message = 'Password reset link sent to your email.';
      },
      error => {
        console.error('Error requesting password reset:', error);
        this.message = error.error.message || 'An error occurred.';
      }
    );
  }
  
  onSubmit() {
    console.log('Attempting to reset password');
    if (this.newPassword !== this.confirmPassword) {
      // this.message = 'Passwords do not match.';
      this.toastr.error('Passwords do not match.', 'Error');
      return;
    }
    if (this.token) {
      console.log('Resetting password with token:', this.token);
      this.userService.setNewPassword(this.token, this.newPassword).subscribe(
        response => {
          console.log('Password reset response:', response);
          this.message = 'Password has been reset successfully.';
          setTimeout(() => this.router.navigate(['/login']), 3000);
        },
        error => {
          console.error('Error resetting password:', error);
          // this.message = error.error.message || 'An error occurred.';
          if (error.error.message === 'Please choose a new password that you haven\'t used before') {
            this.toastr.warning(error.error.message, 'Warning');
          } else {
            this.toastr.error(error.error.message || 'An error occurred', 'Error');
          }
        }
      );
    }
  }
  
  
}
