import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './common/header/header.component';
import { AppToastModule } from './common/app-toast/app-toast.module';
import { PermissionsModule } from './permissions/permissions.module';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PermissionsModule,
    BrowserAnimationsModule,
    AppToastModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
