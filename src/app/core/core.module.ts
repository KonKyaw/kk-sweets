import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreRoutingModule } from './core-routing.module';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './login/login.component';
import { FooterComponent } from './footer/footer.component';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    NavbarComponent,
    LoginComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    CoreRoutingModule,
    MatIconModule
  ],
  exports: [
    NavbarComponent,
    FooterComponent
  ]
})
export class CoreModule { }
