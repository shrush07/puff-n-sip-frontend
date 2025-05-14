import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Import components
import { AppComponent } from './app.component';
import { HomeComponent } from './components/pages/home/home.component';
import { SearchComponent } from './components/partials/search/search.component';
import { TagsComponent } from './components/partials/tags/tags.component';
import { FoodPageComponent } from './components/pages/food-page/food-page.component';
import { CartPageComponent } from './components/pages/cart-page/cart-page.component';
import { TitleComponent } from './components/partials/title/title.component';
import { LoginPageComponent } from './components/pages/login-page/login-page.component';
import { InputContainerComponent } from './components/partials/input-container/input-container.component';
import { InputValidationComponent } from './components/partials/input-validation/input-validation.component';
import { TextInputComponent } from './components/partials/text-input/text-input.component';
import { HeaderComponent } from './components/header/header.component';
import { DefaultButtonComponent } from './components/partials/default-button/default-button.component';
import { RegisterPageComponent } from './components/pages/register-page/register-page.component';
import { CheckoutPageComponent } from './components/pages/checkout-page/checkout-page.component';
import { OrderItemsListComponent } from './components/partials/order-items-list/order-items-list.component';
import { MapComponent } from './components/partials/map/map.component';
import { MenuPageComponent } from './components/pages/menu-page/menu-page.component';
import { ContactPageComponent } from './components/pages/contact-page/contact-page.component';
import { PaymentPageComponent } from './components/pages/payment-page/payment-page.component';
import { ResetPasswordComponent } from './components/pages/reset-password/reset-password.component';
import { FavoritesComponent } from './components/partials/favorites/favorites.component';

// Import services
import { AuthInterceptor } from './auth/auth.interceptor';

// Import third-party modules
import { ToastrModule } from 'ngx-toastr';
import { loadStripe } from '@stripe/stripe-js';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    SearchComponent,
    TagsComponent,
    FavoritesComponent,
    FoodPageComponent,
    CartPageComponent,
    TitleComponent,
    LoginPageComponent,
    InputContainerComponent,
    InputValidationComponent,
    TextInputComponent,
    DefaultButtonComponent,
    RegisterPageComponent,
    CheckoutPageComponent,
    OrderItemsListComponent,
    MapComponent,
    MenuPageComponent,
    ContactPageComponent,
    ResetPasswordComponent,
    PaymentPageComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      newestOnTop: false
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: 'stripe', useFactory: () => loadStripe('pk_test_51Qc8fmJu0UngGxbYyWkfNKhw8I3tZCMLysCPjvRvPXHOlyGQLtXMqgNO0H0erjhpqpvYaXXJfnbQnqVWPSYqM5RK00iOyRlXD4') },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
