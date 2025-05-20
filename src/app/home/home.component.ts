import { STATUS } from './../status.enum';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AppService } from './../app.service';
import { Component, OnInit } from '@angular/core';
import { switchMap, tap, catchError, take } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  recentTxns: any[] = [];
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
  }

  ngOnInit(): void {
    this.app.userEmail
      .pipe(
        switchMap((user) =>
          forkJoin([
            this.app.getBudgets(user as string, STATUS.ACTIVE),
            this.app.getTransactions(user as string, 1, 4),
            this.app.getSpentByUser(user as string),
          ])
        ),
        take(1),
        tap(() => this.app.hideSpinner()),
        catchError((error) => {
          console.error('Error occurred:', error);
          this.app.hideSpinner();
          return of([]);
        })
      )
      .subscribe(([buds, txns, data]) => {
        const budgets = buds as any[];
        const transactions = txns as any;
        const spentData = data as any;
        if (budgets && budgets.length > 0) {
          const budgetsExist = budgets.length > 0;
          localStorage.setItem('isBudgetAvailable', String(budgetsExist));
          this.app.isBudgetAvailableSub.next(budgetsExist);
        }

        if (transactions && transactions.txns && transactions.txns.length > 0) {
          this.recentTxns = transactions.txns;
        }

        if (spentData) {
          this.todaySpending = spentData.totalAmountToday;
          this.weekSpening = spentData.totalAmountThisWeek;
        }
      });
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
