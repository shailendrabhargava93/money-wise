import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { AppService } from './app.service';
import { STATUS } from './status.enum';

export const BudgetResolver: ResolveFn<boolean> = () => {
  const appService = inject(AppService);
  const router = inject(Router);

  return appService.isLoggedIn$.pipe(
    switchMap((isLoggedIn) => {
      if (!isLoggedIn) {
        router.navigate(['login']);
        return of(false);
      }
      return appService.userEmail.pipe(
        switchMap((user) => appService.getBudgets(user as string, STATUS.ACTIVE)),
        map((budgets) => (budgets as any[]) && (budgets as any[]).length > 0),
        tap((isBudgetAvailable) => {
          localStorage.setItem('isBudgetAvailable', String(isBudgetAvailable));
          appService.isBudgetAvailableSub.next(isBudgetAvailable);
          if (!isBudgetAvailable) {
            router.navigate(['setup']);
          }
        }),
        catchError((error) => {
          console.error('Error occurred:', error);
          return of(false);
        })
      );
    })
  );
};