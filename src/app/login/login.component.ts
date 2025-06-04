import { AppService, User } from './../app.service';
import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { GoogleAuthProvider } from '@firebase/auth';
import { NzMessageRef, NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  constructor(
    private angularFireAuth: AngularFireAuth,
    private router: Router,
    private message: NzMessageService,
    private app: AppService
  ) {}
  errorMes!: NzMessageRef;
  loginWithGoogle() {
    const id = this.message.loading('Processing...').messageId;
    this.angularFireAuth
      .signInWithPopup(new GoogleAuthProvider())
      .then((data) => {
        this.message.remove(id);
        this.message.success('Logged in successfully!');

        const user = {
          name: data.user?.displayName,
          email: data.user?.email,
          photo: data.user?.photoURL,
        };

        localStorage.setItem('user', JSON.stringify(user));
        this.app.currentUserSubject.next(user as User);
        this.router.navigate(['home']);
      })
      .catch((error) => {
        this.message.remove(id); // Remove loading message
        console.error(error);

        if (error.code === 'auth/popup-closed-by-user') {
          this.errorMes = this.message.error(
            'Authentication popup was closed. Please try again.'
          );
        } else {
          this.errorMes = this.message.error(`${error.message}`);
        }

        this.router.navigate(['login']);
      });
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
