import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-login-page',
    templateUrl: './login-page.component.html',
    styleUrls: ['./login-page.component.css'],
    standalone: false
})
export class LoginPageComponent implements OnInit {
  loginForm!:FormGroup;
  resetPasswordForm!: FormGroup;
  isSubmitted = false;
  returnUrl = '';
  isLoading: boolean = false;

  // toastrService: any;
  isResetPasswordMode = false; 

  constructor(
    public formBuilder: FormBuilder,
     public userService:UserService,
     public activatedRoute:ActivatedRoute,
     public router:Router, 
     private toastrService: ToastrService) { }

  ngOnInit(): void {
    // Initialize login form
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    // Initialize reset password form
    this.resetPasswordForm = this.formBuilder.group({
      email: ['', Validators.required], // Removed Validators.email
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
    this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/';
  }

  get fc(){
    return this.loginForm.controls;
  }

  get resetFc() {
    return this.resetPasswordForm.controls;
  }

  toggleResetPasswordMode() {
    this.isResetPasswordMode = !this.isResetPasswordMode;
    this.isSubmitted = false;
  }

  submit() {
    this.isSubmitted = true;
    if (this.loginForm.invalid) return;
    console.log('Login form submitted');

    this.userService.login(this.loginForm.value).subscribe({
      next: (user) => {
        console.log('Login successful, user:', user);
        if (user && user.name) { // Check if user and name are defined
          this.toastrService.success(`Welcome ${user.name}!`, 'Login Successful');
          const returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/';
          this.router.navigateByUrl(returnUrl);
        } else {
          console.error('User data is incomplete:', user);
          this.toastrService.error('Login successful but user data is incomplete.', 'Error');
        }
      },
      error: (errorResponse) => {
        console.error('Login failed:', errorResponse);
        this.toastrService.error(errorResponse.error || 'Login Failed', 'Error');
      }
    });
  }
  
  requestPasswordReset() {
    console.log('Reset password - frontend called');
    this.isSubmitted = true;
    const email = this.resetPasswordForm.get('email')?.value;
    
    if (!email) {
      this.toastrService.error('Email is required.', 'Error');
      return;
    }

    this.isLoading = true;

    this.userService.requestPasswordReset(email).subscribe({
      next: () => {
        this.toastrService.success('Password reset link sent to your email.', 'Reset Requested');
        this.toggleResetPasswordMode();
        this.isLoading = false;
      },
      error: (errorResponse) => {
        console.error('Reset password request error:', errorResponse);
        const errorMessage = errorResponse.error?.message || 'Password reset request failed';
        this.toastrService.error(errorMessage, 'Error');
        this.isLoading = false;
      }
    });
  }
}
  
