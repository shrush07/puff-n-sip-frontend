import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { RevenueReportsComponent } from './revenue-reports/revenue-reports.component';
import { TopSellingProductsComponent } from './top-selling-products/top-selling-products.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { UserOrderHistoryComponent } from './user-order-history/user-order-history.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';


@NgModule({
  declarations: [
    AdminComponent,
    TopSellingProductsComponent,
    UserOrderHistoryComponent,
    UserDetailsComponent,
    RevenueReportsComponent,
    AdminDashboardComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
