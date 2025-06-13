import { CompleteBudgetComponent } from './complete-budget/complete-budget.component';
import { BudgetOverviewComponent } from './budget-overview/budget-overview.component';
import { AddBudgetComponent } from './add-budget/add-budget.component';
import { BudgetsComponent } from './budgets/budgets.component';
import { MoreComponent } from './more/more.component';
import { AddTransactionComponent } from './add-transaction/add-transaction.component';
import { HomeComponent } from './home/home.component';
import { authGuard, isBudgetAvailable } from './auth.guard';
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
    path: 'new-transaction',
    component: AddTransactionComponent,
    canActivate: [authGuard, isBudgetAvailable],
  },
  {
    path: 'edit-transaction/:id',
    component: AddTransactionComponent,
    canActivate: [authGuard],
  },
  {
    path: 'budgets',
    component: BudgetsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'archived',
    component: CompleteBudgetComponent,
    canActivate: [authGuard],
  },
  {
    path: 'new-budget',
    component: AddBudgetComponent,
    canActivate: [authGuard],
  },
  {
    path: 'edit-budget/:id',
    component: AddBudgetComponent,
    canActivate: [authGuard],
  },
  {
    path: 'overview/:id',
    component: BudgetOverviewComponent,
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
