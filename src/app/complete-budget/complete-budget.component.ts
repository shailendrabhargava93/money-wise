import { STATUS } from './../status.enum';
import { switchMap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AppService } from './../app.service';
import { Component } from '@angular/core';
import { of } from 'rxjs';

@Component({
  selector: 'app-complete-budget',
  templateUrl: './complete-budget.component.html',
  styleUrls: ['./complete-budget.component.css'],
})
export class CompleteBudgetComponent {
  data!: any[];

  constructor(private app: AppService, private router: Router) {}

  ngOnInit() {
    this.app.showSpinner();
    this.app.userEmail
      .pipe(
        switchMap((user) =>
          this.app.getBudgets(user as string, STATUS.COMPLETED)
        ),
        catchError((error) => {
          console.error('Error occurred getBudgets:', error);
          this.app.hideSpinner();
          return of([]);
        })
      )
      .subscribe((data) => {
        if (data) {
          this.app.hideSpinner();
          this.data = data as any;
        }
      });
  }

  openOverview(budgetId: any) {
    this.router.navigate(['summary', budgetId]);
  }
}
