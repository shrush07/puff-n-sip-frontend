import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../services/auth.service';

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
    private toastr: ToastrService,
    private toastrService: ToastrService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.initializeForms();
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

  submit() {
  this.isSubmitted = true;
  if (this.loginForm.invalid) return;
  console.log('Login form submitted');

  this.userService.login(this.loginForm.value).subscribe({
    next: (user) => {
      // Normalize user.role from isAdmin
      if (user && user.isAdmin !== undefined && !user.role) {
        user.role = user.isAdmin ? 'admin' : 'user';
      }

      console.log('Login successful, received user:', user);

      if (user && user.name && user.token && (user.role === 'admin' || user.role === 'user')) {
        this.authService.login(user.token, user.role);
        this.toastrService.success(`Welcome ${user.name}!`, 'Login Successful');
        const returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/';
        this.router.navigateByUrl(returnUrl);
      } else {
        console.error('User data incomplete. Missing: role');
        this.toastrService.error('Login successful but user data is incomplete.', 'Error');
      }
    },
    error: (errorResponse) => {
      console.error('Login failed:', errorResponse);
      this.toastrService.error(errorResponse.error || 'Login Failed', 'Error');
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
      this.toastr.error('Email is required.', 'Error');
      return;
    }

    this.isLoading = true;
    console.log('Initiating password reset for:', email);

    this.userService.requestPasswordReset(email).subscribe({
      next: () => {
        this.toastr.success('Password reset link sent to your email.', 'Success');
        this.toggleResetPasswordMode();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Password reset request error:', error);
        const message = error.error?.message || 'Password reset failed';
        this.toastr.error(message, 'Error');
        this.isLoading = false;
      }
    });
  }
}
