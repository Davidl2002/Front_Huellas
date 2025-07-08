import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MatSidenavModule } from '@angular/material/sidenav';  
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatListModule } from '@angular/material/list';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { InfoComponent } from './info/info.component';
import { UserInfoComponent } from './user-info/user-info.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    SidebarComponent,
    InfoComponent,
    UserInfoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatButtonModule,
    MatListModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
