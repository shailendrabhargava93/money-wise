import { AppService } from './app.service';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';

export const isLoggedIn: CanActivateFn = () => {
  const appService = inject(AppService);
  const router = inject(Router);
  return appService.isLoggedIn$.pipe(
    map((isLoggedIn) => {
      if (!isLoggedIn) {
        router.navigate(['login']);
        return false;
      }
      return true;
    })
  );
};

export const isBudgetAvailable: CanActivateFn = () => {
  const appService = inject(AppService);
  return appService.isBudgetAvailableSub.pipe(
    map((isBudgetAvailable) => {
      if (!isBudgetAvailable) {
        appService.showPopupSub.next(true);
        return false;
      }
      return true;
    })
  );
};
