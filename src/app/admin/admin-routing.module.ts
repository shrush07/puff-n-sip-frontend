import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TopSellingProductsComponent } from './top-selling-products/top-selling-products.component';
import { UserOrderHistoryComponent } from './user-order-history/user-order-history.component';
import { RevenueReportsComponent } from './revenue-reports/revenue-reports.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';

const routes: Routes = [
  { path: '', component: AdminDashboardComponent }, // default admin route
  { path: 'top-products', component: TopSellingProductsComponent },
  { path: 'user-order-history/:userId', component: UserOrderHistoryComponent },
  { path: 'revenue-reports', component: RevenueReportsComponent },
  { path: 'user-details', component: UserDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
