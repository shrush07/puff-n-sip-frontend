import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { catchError, delay, Observable, of, switchMap, throwError } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private userService: UserService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(this.addToken(request)).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this.handle401Error(request, next);
        }
        return throwError(() => error);
      })
    );
  }

  private addToken(request: HttpRequest<any>): HttpRequest<any> {
    const token = this.userService.getToken();
    if (token) {
      return request.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }
    return request;
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.userService.refreshToken().pipe(
      switchMap((tokens: { token: string, refreshToken: string }) => {
        // Assuming userService.refreshToken() returns both tokens
        this.userService.setTokens(tokens.token, tokens.refreshToken);
        return next.handle(this.addToken(request));
      }),
      catchError(error => {
        console.error('Token refresh failed:', error);
        this.userService.logout();
        return throwError(() => error);
      })
    );
  }
}