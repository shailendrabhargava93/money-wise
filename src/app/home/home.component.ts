import { NzMessageService } from 'ng-zorro-antd/message';
import { AppService } from './../app.service';
import { Component } from '@angular/core';
import { switchMap, tap, catchError } from 'rxjs/operators';
import { EMPTY, of } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  recentTxns!: any[];
  username$ = this.app.userName;
  isBudgetAvailable = this.app.isBudgetAvailableObs$;
  todaySpending!: number;
  weekSpening!: number;
  selectedIndex = 0;
  currency = this.app.currency$;
  greeting!: string;
  enableCurrencyModal = false;

  options = [
    { label: 'Today', value: 'today', icon: 'aim' },
    { label: 'Week', value: 'week', icon: 'calendar' },
  ];

  array = [
    {
      icon: 'assets/home/digital_1.png',
      subheading: 'Limit your use of credit cards to avoid overspending',
    },
    {
      icon: 'assets/home/digital_2.png',
      subheading: 'Cancel any unused or unnecessary subscriptions',
    },
    {
      icon: 'assets/home/digital_3.png',
      subheading:
        'Allocate a specific amount for non-essential spending each month',
    },
    {
      icon: 'assets/home/digital_4.png',
      subheading:
        'Regularly check your bank and credit card statements for any discrepancies',
    },
  ];

  constructor(private app: AppService, private message: NzMessageService) {
    this.getGreeting();
    this.app.showSpinner();
    this.app.userEmail
      .pipe(
        switchMap((user) => this.app.getTransactions(user as string, 1, 4)),
        tap((data: any) => {
          this.app.hideSpinner();
          if (data && data.txns && data.txns.length > 0) {
            const budgetsExist = data.txns && data.txns.length > 0;
            this.recentTxns = data.txns;
            localStorage.setItem('isBudgetAvailable', String(budgetsExist));
            this.app.isBudgetAvailableSub.next(budgetsExist);
          }
        }),
        catchError((error) => {
          this.app.hideSpinner();
          console.error(error);
          return of(EMPTY);
        })
      )
      .subscribe();

      this.app.userEmail
      .pipe(
        switchMap((user) => this.app.getSpentByUser(user as string)),
        tap((data: any) => {
          if (data) {
            this.todaySpending = data.totalAmountToday;
            this.weekSpening = data.totalAmountThisWeek;
          }
        }),
        catchError((error) => {
          this.app.hideSpinner();
          console.error(error);
          return of(EMPTY);
        })
      )
      .subscribe();
  }

  getGreeting() {
    var data: any = [
        [22, 'Working late'],
        [18, 'Good evening'],
        [12, 'Good afternoon'],
        [5, 'Good morning'],
        [0, 'Whoa, early bird'],
      ],
      hr = new Date().getHours();
    for (var i = 0; i < data.length; i++) {
      if (hr >= data[i][0]) {
        const text = data[i][1];
        this.greeting = text;
        break;
      }
    }
  }
}
