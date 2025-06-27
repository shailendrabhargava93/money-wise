import { CAT_ICON } from './../category-config';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { switchMap, catchError, takeUntil } from 'rxjs/operators';
import { of } from 'rxjs';
import { AppService } from '../app.service';

interface Transaction {
  data: {
    title: string;
    date: string;
    amount: number;
  };
}

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css'],
})
export class TransactionsComponent implements OnInit, OnDestroy {
  allTransactions!: Transaction[];
  categories: any[] = [];
  labels: any[] = [];
  sortingType = 'date-asc';
  visibleFilters = false;
  visibleSorting = false;
  showDot = false;
  selectedCategories: string[] = [];
  selectedLabels: string[] = [];
  amountRange: number[] = [];
  highestAmount!: number;
  searchQuery = '';
  message!: string;
  pageNumber = 1;
  loadingMore = false;
  currency!: string | undefined;
  private subscriptions: Subscription[] = [];
  private destroy$ = new Subject<void>();

  constructor(private app: AppService) {}

  ngOnInit(): void {
    this.app.currency.pipe(takeUntil(this.destroy$)).subscribe((m) => {
      this.currency = m?.symbol;
    });
    this.getTransactions();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  onLoadMore(): void {
    this.pageNumber++;
    this.getTransactions();
  }

  private getTransactions(): void {
    this.app.showSpinner();
    const subscription = this.app.userEmail
      .pipe(
        switchMap((user) =>
          this.app.getTransactions(user as string, this.pageNumber)
        ),
        catchError((error) => {
          this.getTransactionsError(error);
          return of([]);
        })
      )
      .subscribe((data) => {
        this.getTransactionsSuccess(data);
      });
    this.subscriptions.push(subscription);
  }

  getLabels() {
    this.app.userEmail
      .pipe(
        switchMap((user) => this.app.getLabels(user as string)),
        catchError((error) => {
          console.error('Error occurred getLabels:', error);
          this.app.hideSpinner();
          return of([]);
        })
      )
      .subscribe((data) => {
        const labels = data as any[];
        if (labels.length > 0) {
          this.labels = data as string[];
        } else {
          this.labels = ['Not available'];
        }
      });
  }

  private getTransactionsSuccess(data: any): void {
    this.app.hideSpinner();
    if (this.pageNumber > 1) {
      this.allTransactions = this.allTransactions.concat(data.txns);
    } else {
      this.allTransactions = data.txns;
    }
    if (this.allTransactions && this.allTransactions.length > 0) {
      this.sort();
      this.highestAmount = data.max;
    }
    if (this.allTransactions.length == 0) {
      this.app.updateMessage('You have no transactions');
    }
    this.loadingMore = data.count > this.allTransactions.length;
  }

  private getTransactionsError(error: any): void {
    this.app.hideSpinner();
    this.loadingMore = false;
    console.error('error orrurced in getTransactions');
  }

  onSearchChange(query: string): void {
    if (query.trim() === '') {
      this.getTransactions();
    } else {
      const filteredTransactions = this.allTransactions.filter(transaction => {
        const title = transaction.data.title.toLowerCase();
        const date = transaction.data.date.toLowerCase();
        const amount = transaction.data.amount.toString().toLowerCase();
        const searchQuery = query.toLowerCase();

        return title.includes(searchQuery) || date.includes(searchQuery) || amount.includes(searchQuery);
      });

      // Update your transactions array with the filtered results
      this.allTransactions = filteredTransactions;
    }
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.getTransactions();
  }

  openFilters(): void {
    this.visibleFilters = true;
    this.getLabels();
    this.categories = Object.entries(CAT_ICON)
      .map(([name, icon]) => ({ name, icon }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  closeFilters(): void {
    this.categories = [];
    this.visibleFilters = false;
  }

  onSelect(catName: string): void {
    const index = this.selectedCategories.indexOf(catName);
    if (index > -1) {
      this.selectedCategories.splice(index, 1);
    } else {
      this.selectedCategories.push(catName);
    }
  }

  onSelectLabel(label: string): void {
    const index = this.selectedLabels.indexOf(label);
    if (index > -1) {
      this.selectedLabels.splice(index, 1);
    } else {
      this.selectedLabels.push(label);
    }
  }

  apply(): void {
    if (this.selectedCategories.length === 0 && !this.amountRange) {
      this.clear();
      return;
    }
    this.loadingMore = false;
    this.app.showSpinner();
    this.closeFilters();
    let email;
    const subscription = this.app.userEmail.subscribe((m) => (email = m));
    const data = {
      email: email,
      categories: this.selectedCategories,
      labels: this.selectedLabels,
      min: this.amountRange ? this.amountRange[0] : null,
      max: this.amountRange ? this.amountRange[1] : null,
    };
    this.app.getFilterTxn(data).subscribe((data) => {
      const txns = data as Transaction[];
      this.app.hideSpinner();
      this.allTransactions = txns;
      this.showDot = true;
      if (txns.length == 0) {
        this.app.updateMessage('No matching transactions found');
      }
    });
    this.subscriptions.push(subscription);
  }

  clear(): void {
    this.showDot = false;
    this.loadingMore = false;
    this.selectedCategories = [];
    this.amountRange = [];
    this.selectedLabels = [];
    this.closeFilters();
    this.getTransactions();
  }

  openSort(): void {
    this.visibleSorting = true;
  }

  closeSort(): void {
    this.visibleSorting = false;
  }

  sort(): void {
    const sortingFunctions: {
      [key: string]: (a: Transaction, b: Transaction) => number;
    } = {
      'date-asc': (a: Transaction, b: Transaction) =>
        new Date(b.data.date).getTime() - new Date(a.data.date).getTime(),
      'date-desc': (a: Transaction, b: Transaction) =>
        new Date(a.data.date).getTime() - new Date(b.data.date).getTime(),
      'name-asc': (a: Transaction, b: Transaction) =>
        a.data.title.toLowerCase().localeCompare(b.data.title.toLowerCase()),
      'name-desc': (a: Transaction, b: Transaction) =>
        b.data.title.toLowerCase().localeCompare(a.data.title.toLowerCase()),
      'amount-asc': (a: Transaction, b: Transaction) =>
        b.data.amount - a.data.amount,
      'amount-desc': (a: Transaction, b: Transaction) =>
        a.data.amount - b.data.amount,
    };

    this.allTransactions = this.allTransactions.sort(
      sortingFunctions[this.sortingType]
    );
    this.closeSort();
  }

  formatTooltip = (value: number): string => {
    return `₹${value.toLocaleString()}`;
  };
}
