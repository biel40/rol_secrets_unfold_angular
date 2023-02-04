import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { AccountComponent } from './account/account.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AttackListComponent } from './attack-list/attack-list-component.component';
import { AccountEditComponent } from './account-edit/account-edit.component'

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    AccountComponent,
    AttackListComponent,
    AccountEditComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
