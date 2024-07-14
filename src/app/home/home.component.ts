import { AppService } from './../app.service';
import { Component } from '@angular/core';
import { switchMap, tap } from 'rxjs/operators';

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

    this.app.userEmail
      .pipe(
        switchMap((user) => this.app.getBudgets(user as string)),
        tap((budgets: any) => {
          const isAvailable = budgets && budgets.length > 0;
          if (isAvailable) {
            const budgetsArray = budgets.map((el: any) => ({
              id: el.id,
              name: el.data.name,
            }));
            localStorage.setItem('isBudgetAvailable', isAvailable);
            localStorage.setItem('budgets', JSON.stringify(budgetsArray));
            this.app.isBudgetAvailableSub.next(isAvailable);
            this.app.budgetValuesSub.next(budgetsArray);
          }
        })
      )
      .subscribe();
  }
}
