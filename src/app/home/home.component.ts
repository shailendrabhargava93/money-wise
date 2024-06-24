import { AppService } from './../app.service';
import { Component } from '@angular/core';
import { filter, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  username$: any;
  constructor(private app: AppService) {
    this.username$ = this.app.userName;

    this.app.isBudgetAvailableObs$
      .pipe(
        filter((isBudgetAvailable) => {
          console.log("isBudgetAvailable : "+isBudgetAvailable)
          return !isBudgetAvailable;
        }) ,
        switchMap(() => this.app.userEmail),
        switchMap((user) => this.app.getBudgets(user as string)),
        tap((budgets: any) => {
          const isAvailable = budgets && budgets.length > 0;
          localStorage.setItem('isBudgetAvailable', isAvailable);
          const budgetsArray = budgets.map((el: any) => ({
            id: el.id,
            name: el.data.name,
          }));
          localStorage.setItem('budgets', JSON.stringify(budgetsArray));
          this.app.isBudgetAvailableSub.next(isAvailable);
        })
      )
      .subscribe();
  }
}
