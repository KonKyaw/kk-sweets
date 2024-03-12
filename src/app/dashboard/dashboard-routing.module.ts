import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardMasterComponent } from './dashboard-master/dashboard-master.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardOrdersComponent } from './dashboard-orders/dashboard-orders.component';
import { ProductFormComponent } from './product-form/product-form.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardMasterComponent,
    children: [
      {
        path: 'products',
        children: [
          {
            path: ':id',
            title: 'Edit product',
            component: ProductFormComponent,
            // canActivate: [authGuard, adminAuthGuard],
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
