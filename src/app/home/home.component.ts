import { AppService } from './../app.service';
import { Component, OnInit } from '@angular/core';
import { switchMap, tap, catchError, take, map } from 'rxjs/operators';
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

  tips = [
    {
      icon: '💳', // credit card
      subheading: 'Limit your use of credit cards to avoid overspending',
    },
    {
      icon: '🔕', // bell off or cancellation
      subheading: 'Cancel any unused or unnecessary subscriptions',
    },
    {
      icon: '💰', // money bag
      subheading:
        'Allocate a specific amount for non-essential spending each month',
    },
    {
      icon: '📄', // document or statement
      subheading:
        'Regularly check your bank and credit card statements for any discrepancies',
    },
  ];

  constructor(private app: AppService) { }

  ngOnInit(): void {
    this.app.showSpinner();
    this.app.userEmail
      .pipe(
        switchMap((user) => {
          const transactionsAndSpent$ = forkJoin([
            this.app.getTransactions(user as string, 1, 4),
            this.app.getSpentByUser(user as string),
          ]);
          return transactionsAndSpent$;
        }),
        take(1),
        tap(() => this.app.hideSpinner()),
        catchError((error) => {
          console.error('Error occurred:', error);
          this.app.hideSpinner();
          return of([null, null]); // Return default structure
        })
      )
      .subscribe(([txns, data]) => {
        const transactions = txns as any;
        const spentData = data as any;

        // Process transactions
        if (transactions && transactions.txns && transactions.txns.length > 0) {
          this.recentTxns = transactions.txns;
        }

        // Process spent data
        if (spentData) {
          this.todaySpending = spentData.totalAmountToday;
          this.weekSpening = spentData.totalAmountThisWeek;
        }
      });
  }
}
