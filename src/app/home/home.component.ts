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

  options = [
    { label: 'Today', value: 'today', icon: 'aim' },
    { label: 'Week', value: 'week', icon: 'calendar' },
  ];

  array = [
    {
      icon: 'assets/home/digital_1.png',
      subheading: 'Limit your use of credit cards to avoid overspending.',
    },
    {
      icon: 'assets/home/digital_2.png',
      subheading: 'Cancel any unused or unnecessary subscriptions.',
    },
    {
      icon: 'assets/home/digital_3.png',
      subheading:
        'Allocate a specific amount for non-essential spending each month.',
    },
    {
      icon: 'assets/home/digital_4.png',
      subheading:
        'Regularly check your bank and credit card statements for any discrepancies.',
    },
  ];

  constructor(private app: AppService) {
    this.getGreeting();
    this.app.showSpinner();
    this.app.userEmail
      .pipe(
        switchMap((user) => this.app.getTransactions(user as string, 1, 3)),
        tap((txns: any) => {
          this.app.hideSpinner();

          if (txns.length > 0) {
            const budgetsExist = txns && txns.length > 0;
            this.recentTxns = txns;
            this.todaySpending = this.getTodaysTotalSpending(this.recentTxns);
            this.weekSpening = this.getCurrentWeeksTotalSpending(
              this.recentTxns
            );
            const currency = {
              name: 'Indian rupee',
              symbol: '₹',
            };
            localStorage.setItem('isBudgetAvailable', String(budgetsExist));
            localStorage.setItem('currency', JSON.stringify(currency));

            this.app.currencySub.next(currency);
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
        console.log(text);
        this.greeting = text;
        break;
      }
    }
  }

  getTodaysTotalSpending(transactions: any[]): number {
    const today = new Date().toISOString().split('T')[0];

    const filteredTransactions = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.data.date)
        .toISOString()
        .split('T')[0];
      return transactionDate === today;
    });

    const totalAmount = filteredTransactions.reduce(
      (total, transaction) => total + transaction.data.amount,
      0
    );

    return totalAmount;
  }

  getCurrentWeeksTotalSpending(transactions: any[]): number {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const total = transactions
      .filter((transaction) => {
        const transactionDate = new Date(transaction.data.date);
        return transactionDate >= startOfWeek && transactionDate <= today;
      })
      .reduce((total, transaction) => total + transaction.data.amount, 0);

    return total;
  }
}
