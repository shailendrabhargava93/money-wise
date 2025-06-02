import { STATUS } from './../status.enum';
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

  constructor(private app: AppService) {}

  ngOnInit(): void {
    const isBudgetAvailable =
      localStorage.getItem('isBudgetAvailable') === 'true';
    this.app.showSpinner();
    this.app.userEmail
      .pipe(
        switchMap((user) => {
          // Always call transactions and spent data APIs
          const transactionsAndSpent$ = forkJoin([
            this.app.getTransactions(user as string, 1, 4),
            this.app.getSpentByUser(user as string),
          ]);

          // Conditionally call budgets API only if not available in localStorage
          if (isBudgetAvailable) {
            // Skip budget API call, return only transactions and spent data
            return transactionsAndSpent$.pipe(
              map(([txns, data]) => [[], txns, data]) // Empty array for budgets
            );
          } else {
            // Call all three APIs including budgets
            return forkJoin([
              this.app.getBudgets(user as string, STATUS.ACTIVE),
              transactionsAndSpent$,
            ]).pipe(map(([buds, [txns, data]]) => [buds, txns, data]));
          }
        }),
        take(1),
        tap(() => this.app.hideSpinner()),
        catchError((error) => {
          console.error('Error occurred:', error);
          this.app.hideSpinner();
          return of([[], null, null]); // Return default structure
        })
      )
      .subscribe(([buds, txns, data]) => {
        const budgets = buds as any[];
        const transactions = txns as any;
        const spentData = data as any;

        // Only process budgets if we actually fetched them (when isBudgetAvailable was false)
        if (!isBudgetAvailable && budgets && budgets.length > 0) {
          const budgetsExist = budgets.length > 0;
          localStorage.setItem('isBudgetAvailable', String(budgetsExist));
          this.app.isBudgetAvailableSub.next(budgetsExist);
        }

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
