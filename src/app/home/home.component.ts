import { AppService } from './../app.service';
import { Component } from '@angular/core';
import { switchMap, tap, catchError } from 'rxjs/operators';
import { EMPTY, of } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  username$: any;
  isBudgetAvailable = this.app.isBudgetAvailableObs$;

  constructor(private app: AppService) {
    this.username$ = this.app.userName;
    this.app.showSpinner();
    this.app.userEmail
      .pipe(
        switchMap((user) => this.app.getBudgets(user as string)),
        tap((budgets: any) => {
          this.app.hideSpinner();
          const currency = {
            name: 'Indian rupee',
            symbol: '₹',
          };
          localStorage.setItem('currency', JSON.stringify(currency));
          this.app.currencySub.next(currency);

          const budgetsExist = budgets && budgets.length > 0;
          localStorage.setItem('isBudgetAvailable', String(budgetsExist));
          this.app.isBudgetAvailableSub.next(budgetsExist);

          if (budgetsExist) {
            const budgetsArray = budgets.map((budget: any) => ({
              id: budget.id,
              name: budget.data.name,
            }));
            localStorage.setItem('budgets', JSON.stringify(budgetsArray));
            this.app.budgetValuesSub.next(budgetsArray);
          }
        }),
        catchError(error => {
          this.app.hideSpinner();
          console.error(error);
          return of(EMPTY);
        })
      )
      .subscribe();
  }
}
