import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
  standalone: false
})
export class LoginPageComponent implements OnInit {
  public loginForm!: FormGroup;
  public resetPasswordForm!: FormGroup;
  public isSubmitted = false;
  public returnUrl = ''; 
  public isLoading = false;
  public isResetPasswordMode = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastrService: ToastrService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.initializeForms();
    this.activatedRoute.queryParams.subscribe(params => {
      this.returnUrl = params['returnUrl'] || '/';
    });
  }

  private initializeForms() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['user', Validators.required]
    });

    this.resetPasswordForm = this.fb.group({
      email: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get fc() {
    return this.loginForm.controls;
  }

  get resetFc() {
    return this.resetPasswordForm.controls;
  }

  toggleResetPasswordMode() {
    this.isResetPasswordMode = !this.isResetPasswordMode;
    this.isSubmitted = false;
  }

  submit(): void {
  this.isSubmitted = true;

  if (this.loginForm.invalid) {
    console.warn('Login form is invalid');
    return;
  }

  const loginData = {
    email: this.fc.email.value,
    password: this.fc.password.value,
    role: this.fc.role.value
  };

  console.log('Attempting login with:', loginData);

  this.userService.login(loginData).subscribe({
    next: (user) => {
      console.log('Login response from backend:', user);

      // 1️⃣ Ensure token exists
      if (user.token && user.refreshToken) {
        console.log('Tokens received from backend:', {
          token: user.token,
          refreshToken: user.refreshToken
        });

        // 2️⃣ Save tokens to localStorage & update BehaviorSubject
        this.userService.setTokens(user.token, user.refreshToken);

        console.log('Token in localStorage after setTokens():', localStorage.getItem('token'));
      } else {
        console.warn('Login response missing token or refreshToken');
      }

      // 3️⃣ Save full user object in localStorage
      this.userService.setUserToLocalStorage(user);
      console.log('User saved in localStorage:', JSON.parse(localStorage.getItem('User') || '{}'));

      // 4️⃣ Redirect logic
      const returnUrl = this.returnUrl || '/';
      if (user.isAdmin && loginData.role === 'admin') {
        console.log('Redirecting to admin dashboard...');
        this.router.navigateByUrl('/admin-dashboard');
      } else {
        console.log('Redirecting to returnUrl:', returnUrl);
        this.router.navigateByUrl(returnUrl);
      }
    },
    error: (err: any) => {
      console.error('Login failed:', err);
      this.toastrService.error(err.error?.message || 'Login failed', 'Error');
    }
  });
}


  private checkUserFields(user: any): string[] {
    const requiredFields = ['token', 'name', 'email', 'address', 'role'];
    return requiredFields.filter(field => !user[field]);
  }

  requestPasswordReset() {
    this.isSubmitted = true;
    const email = this.resetFc['email'].value;

    if (!email) {
      this.toastrService.error('Email is required.', 'Error');
      return;
    }

    this.isLoading = true;
    console.log('Initiating password reset for:', email);

    this.userService.requestPasswordReset(email).subscribe({
      next: () => {
        this.toastrService.success('Password reset link sent to your email.', 'Success');
        this.toggleResetPasswordMode();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Password reset request error:', error);
        const message = error.error?.message || 'Password reset failed';
        this.toastrService.error(message, 'Error');
        this.isLoading = false;
      }
    });
  }
}
