import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttackListComponent } from './attack-list/attack-list-component.component';
import { AccountEditComponent } from './account-edit/account-edit.component';
import { AccountComponent } from './account/account.component';
import { AuthComponent } from './auth/auth.component';
import { StatsEditComponent } from './stats-edit/stats-edit.component';

const routes: Routes = [
  { path: '', component: AuthComponent},
  { path: 'account', component: AccountComponent},
  { path: 'attackList', component: AttackListComponent, pathMatch: 'full'},
  { path: 'accountEdit', component: AccountEditComponent, pathMatch: 'full'},
  { path: 'statsEdit', component: StatsEditComponent, pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
