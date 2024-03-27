import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreRoutingModule } from './core-routing.module';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './login/login.component';
import { FooterComponent } from './footer/footer.component';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from 'shared/shared.module';


@NgModule({
  declarations: [
    NavbarComponent,
    LoginComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    CoreRoutingModule,
    MatIconModule
  ],
  exports: [
    NavbarComponent,
    FooterComponent
  ]
})
export class CoreModule { }
