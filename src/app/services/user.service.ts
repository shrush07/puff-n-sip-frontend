import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, catchError, Observable, switchMap, tap, throwError } from 'rxjs';
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
  private userSubject: BehaviorSubject<User>;
  public userObservable: Observable<User>;

  constructor(private http: HttpClient, private toastrService: ToastrService) {
    this.userSubject = new BehaviorSubject<User>(this.getUserFromLocalStorage());
    this.userObservable = this.userSubject.asObservable();
  }
  

  public setTokens(token: string, refreshToken: string) {
    console.log('Setting tokens:', { token, refreshToken });
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  
    // Log to verify they are stored
    console.log('Stored token:', localStorage.getItem(TOKEN_KEY));
    console.log('Stored refresh token:', localStorage.getItem(REFRESH_TOKEN_KEY));
  
    const user = this.getUserFromLocalStorage();
    user.token = token;
    this.setUserToLocalStorage(user);
    this.userSubject.next(user);
  }

  getToken(): string | null {
    const token = localStorage.getItem(TOKEN_KEY);
    console.log('Retrieved token:', token);
    if (!token) {
      console.warn('No token found in localStorage');
    }
    return token;
  }
  get currentUser(): User {
    return this.userSubject.value;
  }

  login(userLogin: IUserLogin): Observable<User> {
    return this.http.post<User>(USER_LOGIN_URL, userLogin).pipe(
      tap(user => {
        console.log('Login response:', user); // Log the entire response
        console.log("user:", user);
        if (user.token && user.refreshToken) {
          console.log('Setting tokens after login');
          this.setTokens(user.token, user.refreshToken);
          console.log('Set tokens after login:');

        } else {
          console.error('Token or refreshToken missing in login response');
        }
        this.setUserToLocalStorage(user);
        this.userSubject.next(user);
      }),
      catchError(this.handleError)
    );
  }

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

  isTokenExpired(): boolean {
  const token = this.getToken();
  if (!token) return true;

  try {
    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    return (Math.floor((new Date).getTime() / 1000)) >= expiry;
  } catch (e) {
    console.warn('Invalid token format', e);
    return true;
  }
}


  logout(): void {
    this.userSubject.next(new User());
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    window.location.reload();
  }

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

  
  private setUserToLocalStorage(user: User): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  private getUserFromLocalStorage(): User {
    const userJson = localStorage.getItem(USER_KEY);
    return userJson ? JSON.parse(userJson) : new User();
  }

  private handleError(errorResponse: any): Observable<never> {
    console.error('API error:', errorResponse);
    this.toastrService.error(errorResponse.error?.message || 'An error occurred', 'Error');
    return throwError(() => errorResponse);
  }
  
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token'); // Check if token exists
  }


  // New methods for password reset functionality
//Requesting a password reset (which sends an email with a reset link)
  requestPasswordReset(email: string): Observable<any> {
    return this.http.post(`${RESET_PASSWORD_URL}`, { email }).pipe(
      tap(() => {
        this.toastrService.success('Password reset link sent to your email.', 'Reset Requested');
      }),
      catchError(this.handleError)
    );
  }
  
  //Setting a new password (using the token from the reset link)
  setNewPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${RESET_PASSWORD_URL}/${token}`, { newPassword }).pipe(
      tap(() => {
        this.toastrService.success('Your password has been reset successfully.', 'Password Reset');
      }),
      catchError(this.handleError)
    );
  }
 
  
}