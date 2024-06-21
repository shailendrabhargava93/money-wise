import { AppService } from './app.service';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';

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
  const notification = inject(NzNotificationService);
  let isThere;
  appService.isBudgetAvailable$.subscribe((lg) => (isThere = lg));
  if (!isThere) {
    notification.create(
      'info',
      'Alert',
      'You need to have a budget for adding any transacion. Please create a budegt first',
      { nzPlacement: 'top' }
    );
    return false;
  }
  return true;
};
