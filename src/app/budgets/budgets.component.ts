import { tap } from 'rxjs/operators';
import { STATUS } from './../status.enum';
import { Router } from '@angular/router';
import { AppService } from './../app.service';
import { Component, OnInit } from '@angular/core';
import { catchError, of, switchMap, EMPTY } from 'rxjs';

@Component({
  selector: 'app-budgets',
  templateUrl: './budgets.component.html',
  styleUrls: ['./budgets.component.css'],
})
export class BudgetsComponent implements OnInit {
  budgets!: any[];
  currency = this.app.currency$;

  isVisible = false;
  budgetData!: any;
  users!: any[];

  constructor(private app: AppService, private router: Router) {}

  ngOnInit(): void {
    this.app.showSpinner();

    this.app.userEmail
      .pipe(
        switchMap((user) => this.app.getBudgets(user as string, STATUS.ACTIVE)),
        catchError((error) => {
          console.error('Error occurred getBudgets:', error);
          this.app.hideSpinner();
          return EMPTY;
        }),
        tap(() => this.app.hideSpinner())
      )
      .subscribe((data: any) => {
        if (data && data.length > 0) {
          localStorage.setItem('isBudgetAvailable', 'true');
          this.app.isBudgetAvailableSub.next(true);
          this.budgets = data;
        } else {
          localStorage.setItem('isBudgetAvailable', 'false');
          this.app.isBudgetAvailableSub.next(false);
        }
      });
  }

  onShare(budget: any) {
    this.budgetData = { id: budget.id, name: budget.data.name };
    this.users = this.modifyrUsers(budget.data.users, budget.data.createdBy);
    this.isVisible = true;
  }

  onclose() {
    this.isVisible = false;
  }

  modifyrUsers(users: string[], createdBy: string) {
    return users.map((user) => {
      if (user !== createdBy) {
        return { email: user, delete: true };
      } else {
        return { email: user, delete: false };
      }
    });
  }

  getSpentPerc(budget: any) {
    return Math.round(
      (budget.data.spentAmount / budget.data.totalBudget) * 100
    );
  }

  isOverspent(budget: any) {
    return budget.data.totalBudget - budget.data.spentAmount < 0 ? true : false;
  }

  openOverview(budgetId: any) {
    this.router.navigate(['overview', budgetId]);
  }

  editBudget(budgetId: any) {
    this.router.navigate(['edit-budget', budgetId]);
  }
}
