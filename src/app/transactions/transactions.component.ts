import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { AppService } from '../app.service';
import { CAT_ICON } from '../category-icons';

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
  sortingType = 'date-asc';
  visibleFilters = false;
  visibleSorting = false;
  showDot = false;
  selectedCategories: string[] = [];
  amountRange: number[] = [];
  highestAmount!: number;
  searchQuery = '';
  message!: string;
  pageNumber = 1;
  loadingMore = false;
  currency!: string | undefined;
  private subscriptions: Subscription[] = [];

  constructor(private app: AppService) {}

  ngOnInit(): void {
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
      // const subscription = this.app.getTransactionsBySearch(query).subscribe((data) => {
      //   this.allTransactions = data;
      // });
      // this.subscriptions.push(subscription);
    }
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.getTransactions();
  }

  openFilters(): void {
    this.app.currency.subscribe((m) => (this.currency = m?.symbol));
    this.visibleFilters = true;
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
    this.loadingMore = true;
    this.selectedCategories = [];
    this.amountRange = [];
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

  // formatter(value: number): string {
  //   if (this.currency) {
  //     return `${this.currency} ${value}`;
  //   }
  //   return `${value}`;
  // }
}
