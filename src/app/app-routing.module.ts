import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttackListComponent } from './attack-list/attack-list-component.component';
import { AccountComponent } from './account/account.component';

const routes: Routes = [
  { path: 'account', component: AccountComponent},
  { path: 'attackList', component: AttackListComponent, pathMatch: 'full'},
  { path: 'accountEdit', component: AttackListComponent, pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
