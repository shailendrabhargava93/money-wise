import { CompleteBudgetComponent } from './complete-budget/complete-budget.component';
import { BudgetOverviewComponent } from './budget-overview/budget-overview.component';
import { AddBudgetComponent } from './add-budget/add-budget.component';
import { BudgetsComponent } from './budgets/budgets.component';
import { MoreComponent } from './more/more.component';
import { AddTransactionComponent } from './add-transaction/add-transaction.component';
import { HomeComponent } from './home/home.component';
import { isBudgetAvailable, isLoggedIn } from './auth.guard';
import { LoginComponent } from './login/login.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BudgetResolver } from './budget-resolver.service';
import { SetupComponent } from './setup/setup.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'home', component: HomeComponent,
    canActivate: [isLoggedIn],
    resolve: {
      budgetAvailable: BudgetResolver
    }
  },
  {
    path: 'transactions',
    component: TransactionsComponent,
    canActivate: [isLoggedIn],
  },
  {
    path: 'new-transaction',
    component: AddTransactionComponent,
    canActivate: [isLoggedIn, isBudgetAvailable],
  },
  {
    path: 'edit-transaction/:id',
    component: AddTransactionComponent,
    canActivate: [isLoggedIn],
  },
  {
    path: 'budgets',
    component: BudgetsComponent,
    canActivate: [isLoggedIn],
  },
  {
    path: 'completed',
    component: CompleteBudgetComponent,
    canActivate: [isLoggedIn],
  },
  {
    path: 'new-budget',
    component: AddBudgetComponent,
    canActivate: [isLoggedIn],
  },
  {
    path: 'edit-budget/:id',
    component: AddBudgetComponent,
    canActivate: [isLoggedIn],
  },
  {
    path: 'overview/:id',
    component: BudgetOverviewComponent,
    canActivate: [isLoggedIn],
  },
  {
    path: 'more',
    component: MoreComponent,
    canActivate: [isLoggedIn],
  },
  {
    path: 'setup',
    component: SetupComponent,
    canActivate: [isLoggedIn]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
