import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TopPageRoutingModule } from './top-page-routing.module';
import { ProductsComponent } from './products/products.component';
import { ProductFilterComponent } from './product-filter/product-filter.component';
import { SharedModule } from 'shared/shared.module';
import { TopPageComponent } from './top-page/top-page.component';


@NgModule({
  declarations: [
    ProductsComponent,
    ProductFilterComponent,
    TopPageComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    TopPageRoutingModule
  ]
})
export class TopPageModule { }
