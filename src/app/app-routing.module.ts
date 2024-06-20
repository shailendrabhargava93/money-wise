import { BudgetsComponent } from './budgets/budgets.component';
import { MoreComponent } from './more/more.component';
import { AddTransactionComponent } from './add-transaction/add-transaction.component';
import { HomeComponent } from './home/home.component';
import { authGuard, isBudgetCreated } from './auth.guard';
import { LoginComponent } from './login/login.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  {
    path: 'transactions',
    component: TransactionsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'add',
    component: AddTransactionComponent,
    canActivate: [authGuard, isBudgetCreated],
  },
  {
    path: 'budgets',
    component: BudgetsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'more',
    component: MoreComponent,
    canActivate: [authGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
