import { AppService } from './app.service';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const appService = inject(AppService);
  const router = inject(Router);
  let isLogin;
  appService.isLoggedIn$.subscribe((lg) => (isLogin = lg));
  if (!isLogin) {
    router.navigate(['login']);
    return false;
  }
  return true;
};

export const isBudgetAvailable: CanActivateFn = () => {
  const appService = inject(AppService);
  let isThere;
  appService.isBudgetAvailable.subscribe((lg) => (isThere = lg));
  if (!isThere) {
    appService.showPopupSub.next(true);
    return false;
  }
  return true;
};
