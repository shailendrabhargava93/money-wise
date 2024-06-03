import { AppService } from './app.service';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const appService = inject(AppService);
  const router = inject(Router);
  if (!appService.isLoggedIn) {
    router.navigate(['login']);
    return false;
  }
  return true;
};
