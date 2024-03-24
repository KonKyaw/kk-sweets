import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardMasterComponent } from './dashboard-master/dashboard-master.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardOrdersComponent } from './dashboard-orders/dashboard-orders.component';
import { ProductFormComponent } from './product-form/product-form.component';
import { authGuard } from 'shared/services/auth-guard/auth-guard.component';
import { adminAuthGuard } from 'shared/services/auth-guard/admin-auth-guard';

const routes: Routes = [
  {
    path: '',
    component: DashboardMasterComponent,
    canActivate: [authGuard, adminAuthGuard],
    children: [
      {
        path: 'products',
        children: [
          {
            path: ':id',
            title: 'Edit product',
            component: ProductFormComponent,
          },
          {
            path: 'new',
            title: 'Create new product',
            component: ProductFormComponent
          }
        ]
      },
      {
        path: 'orders',
        component: DashboardOrdersComponent
      },
      {
        path: '',
        component: DashboardComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
