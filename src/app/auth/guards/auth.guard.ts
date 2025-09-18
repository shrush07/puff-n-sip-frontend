import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { UserService } from '../../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const token = this.userService.getToken();
    const isExpired = this.userService.isTokenExpired();

    if (token && !isExpired) {
      return true;
    }

    if (token && isExpired) {
      return this.userService.refreshToken().pipe(
        map(() => true),
        catchError(() => {
          this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
          return of(false);
        })
      );
    }

  this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
  }
}
