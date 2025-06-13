import { AppService, User } from './../app.service';
import { Component,OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { GoogleAuthProvider } from '@firebase/auth';
import { NzMessageRef, NzMessageService } from 'ng-zorro-antd/message';
import { from, Subject } from 'rxjs';
import { tap, catchError, map, switchMap, finalize, takeUntil } from 'rxjs/operators'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnDestroy{
  constructor(
    private angularFireAuth: AngularFireAuth,
    private router: Router,
    private message: NzMessageService,
    private app: AppService
  ) {}
  errorMes!: NzMessageRef;
  isLoginInProgress = false;
  private destroy$ = new Subject<void>();

  loginWithGoogle() {
    if (this.isLoginInProgress) {
      this.errorMes = this.message.error('Another authentication popup is already open. Please try again.');
      return;
    }
    this.isLoginInProgress = true;
    const provider = new GoogleAuthProvider();
    const authObservable = from(this.angularFireAuth.signInWithPopup(provider));

    authObservable.pipe(
      takeUntil(this.destroy$),
      map((data:any) => ({
        name: data.user?.displayName,
        email: data.user?.email,
        photo: data.user?.photoURL,
      })),
      switchMap((user) => {
        localStorage.setItem('user', JSON.stringify(user));
        this.app.currentUserSubject.next(user as User);
        return this.router.navigate(['home']).then(() => user);
      }),
      tap(() => this.message.success('Logged in successfully!')),
      catchError((error: any) => {
        console.error(error);
        if (error.code === 'auth/popup-closed-by-user') {
          this.errorMes = this.message.error('Authentication popup was closed. Please try again.');
        } else if (error.code === 'auth/cancelled-popup-request') {
          this.errorMes = this.message.error('Another authentication popup is already open. Please try again.');
        } else {
          this.errorMes = this.message.error(`${error.message}`);
        }
        this.router.navigate(['login']);
        throw error; // rethrow error
      }),
      finalize(() => {
        this.isLoginInProgress = false;
      })
    ).subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  carasoul = [
    {
      heading: 'Welcome to Money Wise',
      subheading:
        'Take control of your money by tracking your spending habits wisely',
      image: 'assets/slider/Wallet-pana.svg',
    },
    {
      heading: 'Save Money with ease',
      subheading:
        'Plan wisely with budgets, share and manage them with family or partner',
      image: 'assets/slider/Growth-analytics-pana.svg',
    },
    {
      heading: 'Analyse your all finances',
      subheading:
        'Keep an eye on your progress, track it, and get the hang of the numbers',
      image: 'assets/slider/Business-Plan-pana.svg',
    },
    {
      heading: 'Improve your saving habits',
      subheading:
        'Boost your financial independence by leveling up your savings habit',
      image: 'assets/slider/Investing-pana.svg',
    },
  ];
}
