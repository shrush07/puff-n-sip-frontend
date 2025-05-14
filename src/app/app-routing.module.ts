import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './components/pages/home/home.component';
import { FoodPageComponent } from './components/pages/food-page/food-page.component';
import { CartPageComponent } from './components/pages/cart-page/cart-page.component';
import { LoginPageComponent } from './components/pages/login-page/login-page.component';
import { RegisterPageComponent } from './components/pages/register-page/register-page.component';
import { CheckoutPageComponent } from './components/pages/checkout-page/checkout-page.component';
import { MenuPageComponent } from './components/pages/menu-page/menu-page.component';
import { ContactPageComponent } from './components/pages/contact-page/contact-page.component';
import { PaymentPageComponent } from './components/pages/payment-page/payment-page.component';
import { ResetPasswordComponent } from './components/pages/reset-password/reset-password.component';
import { FavoritesComponent } from './components/pages/favorites/favorites.component';

import { AuthGuard } from './auth/guards/auth.guard';
import { AdminGuard } from './auth/guards/admin.guard';

const routes: Routes = [
  // Public user routes
  { path: '', component: HomeComponent },
  { path: 'menu', component: MenuPageComponent },
  { path: 'contact', component: ContactPageComponent },
  { path: 'search/:searchTerm', component: HomeComponent },
  { path: 'tag/:tag', component: HomeComponent },
  { path: 'food/:id', component: FoodPageComponent },
  { path: 'cart-page', component: CartPageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterPageComponent },
  { path: 'reset-password/:token', component: ResetPasswordComponent },
  { path: 'favorites', component: FavoritesComponent },

  // Protected user routes
  { path: 'checkout', component: CheckoutPageComponent, canActivate: [AuthGuard] },
  { path: 'payment-page', component: PaymentPageComponent, canActivate: [AuthGuard] },
  { path: 'payment-page/:orderId', component: PaymentPageComponent, canActivate: [AuthGuard] },

  // Admin module (protected by admin guard)
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canActivate: [AdminGuard]
  },

  // Optional: Lazy-loaded user dashboard module in future
  // {
  //   path: 'user',
  //   loadChildren: () => import('./components/pages/user.module').then(m => m.UserModule),
  //   canActivate: [AuthGuard]
  // },

  // Wildcard
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
