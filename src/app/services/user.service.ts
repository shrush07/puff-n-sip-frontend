import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { IUserLogin } from '../shared/interfaces/IUserLogin';
import { IUserRegister } from '../shared/interfaces/IUserRegister';
import { RESET_PASSWORD_URL, USER_LOGIN_URL, USER_REGISTER_URL } from '../shared/constants/urls';
import { User } from '../shared/models/User';

const USER_KEY = 'User';
const TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refreshToken';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public userSubject: BehaviorSubject<User>;
  public userObservable: Observable<User>;

  constructor(private http: HttpClient, private toastrService: ToastrService) {
    // Initialize userSubject with stored user from localStorage
    this.userSubject = new BehaviorSubject<User>(this.getUserFromLocalStorage());
    this.userObservable = this.userSubject.asObservable();
  }

  // Set both JWT and refresh token in localStorage
  public setTokens(token: string, refreshToken: string) {
  console.log('Setting tokens:', { token, refreshToken });

  // Save tokens directly
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);

  // Update user object
  const user = this.getUserFromLocalStorage();
  user.token = token;
  user.refreshToken = refreshToken; // <-- include refreshToken too
  this.setUserToLocalStorage(user);

  // Update BehaviorSubject
  this.userSubject.next(user);

  console.log('Stored token in localStorage:', localStorage.getItem(TOKEN_KEY));
}


  // Retrieve JWT token from localStorage
  getToken(): string | null {
    const token = localStorage.getItem(TOKEN_KEY);
    console.log('Retrieved token:', token);
    if (!token) {
      console.warn('No token found in localStorage');
    }
    return token;
  }

  // Return the current user from BehaviorSubject
  get currentUser(): User {
    return this.userSubject.value;
  }

  // Login API call
  login(userLogin: IUserLogin): Observable<User> {
    return this.http.post<User>(USER_LOGIN_URL, userLogin).pipe(
      tap(user => {
        console.log('Login response:', user); // Log the entire response

        // If backend returns token, store it; else skip
        if (user.token && user.refreshToken) {
          console.log('Setting tokens after login');
          this.setTokens(user.token, user.refreshToken);
        } else {
          console.warn('Token or refreshToken missing in login response - using currentUser only');
        }

        // Save user info to localStorage anyway
        this.setUserToLocalStorage(user);
        this.userSubject.next(user);
      }),
      catchError(this.handleError)
    );
  }

  // Register API call
  register(userRegister: IUserRegister): Observable<User> {
    return this.http.post<User>(USER_REGISTER_URL, userRegister).pipe(
      tap(user => {
        this.setUserToLocalStorage(user);
        this.userSubject.next(user);
        this.toastrService.success(`Welcome to Puff & Sip, ${user.name}`, 'Register Successful');
      }),
      catchError(this.handleError)
    );
  }

  // Check if token is expired
  isTokenExpired(): boolean {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token || token.split('.').length !== 3) {
      return true;
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp;
      return Math.floor(Date.now() / 1000) > expiry;
    } catch (error) {
      console.error('Invalid token format:', error);
      return true;
    }
  }

  // Logout the user
  logout(): void {
    this.userSubject.next(new User());
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    window.location.reload();
  }

  // Refresh JWT token
  refreshToken(): Observable<{ token: string, refreshToken: string }> {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }
    return this.http.post<{ token: string, refreshToken: string }>('/api/auth/refresh', { refreshToken }).pipe(
      tap(tokens => {
        this.setTokens(tokens.token, tokens.refreshToken);
      }),
      catchError(error => {
        console.error('Token refresh failed:', error);
        this.logout();
        return throwError(() => new Error('Token refresh failed'));
      })
    );
  }

  // Load currentUser from token (useful on page reloads)
  public loadCurrentUserFromToken(): void {
    const user = this.getUserFromLocalStorage();
    if (user && user.token && !this.isTokenExpired()) {
      this.userSubject.next(user);
    }
    // Don't logout automatically here — just treat as not logged in
  }

  // Safely get the valid current user
  public getValidCurrentUser(): User | null {
    const user = this.getUserFromLocalStorage();
    if (user && user.id) {
      return user;
    }
    return null;
  }

  // Save user object to localStorage
  public setUserToLocalStorage(user: User): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  // Retrieve user object from localStorage
  private getUserFromLocalStorage(): User {
    const userJson = localStorage.getItem(USER_KEY);
    return userJson ? JSON.parse(userJson) : new User();
  }

  // Handle API errors
  private handleError(errorResponse: any): Observable<never> {
    console.error('API error:', errorResponse);
    this.toastrService.error(errorResponse.error?.message || 'An error occurred', 'Error');
    return throwError(() => errorResponse);
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    const user = this.getUserFromLocalStorage();
    return !!user?.id; // Logged in if user has an id
  }

  // Check if the user is effectively logged in
  public hasValidTokenOrUser(): boolean {
    const user = this.getUserFromLocalStorage();
    const token = this.getToken();
    return !!user?.id || (!!token && !this.isTokenExpired());
  }

    public setTemporaryToken() {
    const tempToken = 'temp-token'; // dummy token to allow navigation
    const user = this.getUserFromLocalStorage();
    user.token = tempToken;
    this.setUserToLocalStorage(user);
    this.userSubject.next(user);
    localStorage.setItem('token', tempToken);
  }

  // New methods for password reset functionality
  // Requesting a password reset (which sends an email with a reset link)
  requestPasswordReset(email: string): Observable<any> {
    return this.http.post(`${RESET_PASSWORD_URL}`, { email }).pipe(
      tap(() => {
        this.toastrService.success('Password reset link sent to your email.', 'Reset Requested');
      }),
      catchError(this.handleError)
    );
  }

  // Setting a new password (using the token from the reset link)
  setNewPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${RESET_PASSWORD_URL}/${token}`, { newPassword }).pipe(
      tap(() => {
        this.toastrService.success('Your password has been reset successfully.', 'Password Reset');
      }),
      catchError(this.handleError)
    );
  }
}
