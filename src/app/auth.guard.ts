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
