import { catchError, switchMap } from 'rxjs/operators';
import { CAT_ICON } from './../category-icons';
import { AppService } from './../app.service';
import { Component, OnInit } from '@angular/core';
import { of } from 'rxjs';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css'],
})
export class TransactionsComponent implements OnInit {
  allTransactions!: any[];
  categories: any[] = [];
  sortingType = 'date-asc';
  visibleFilters = false;
  visibleSorting = false;
  showDot = false;
  selectedCategories: string[] = [];
  amountRange!: any[];
  highestAmount!: number;

  message!: string;
  pageNumber: number = 1;
  loadingMore = false;
  currency!: string | undefined;
  constructor(private app: AppService) {}

  ngOnInit() {
    this.getTransactions();
  }

  onLoadMore(): void {
    this.pageNumber = this.pageNumber + 1;
    this.getTransactions();
  }

  private getTransactions() {
    this.app.showSpinner();
    this.app.userEmail
      .pipe(
        switchMap((user) =>
          this.app.getTransactions(user as string, this.pageNumber)
        ),
        catchError((error) => {
          console.error('Error occurred getTransactions:', error);
          this.app.hideSpinner();
          this.loadingMore = false;
          return of([]);
        })
      )
      .subscribe((data: any) => {
        if (data && data.txns) {
          this.app.hideSpinner();
          if (this.pageNumber > 1) {
            this.allTransactions = this.allTransactions.concat(data.txns);
          } else {
            this.allTransactions = data.txns as any[];
          }
          if (this.allTransactions && this.allTransactions.length > 0) {
            this.sort();
            this.highestAmount = data.max;
          }
          this.loadingMore = data.count > this.allTransactions.length;
        } else {
          this.allTransactions = data;
        }
      });
  }

  searchQuery = '';

  onSearchChange(query: string): void {
    // You can call a service or filter the transactions here
    this.allTransactions.filter(txn =>
      txn.data.title.toLowerCase().includes(query.toLowerCase())
    );
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.onSearchChange('');
  }


  openFilters(): void {
    this.app.currency.subscribe((m) => (this.currency = m?.symbol));
    this.visibleFilters = true;
    for (var n in CAT_ICON) {
      const icon = CAT_ICON[n as keyof typeof CAT_ICON];
      this.categories.push({ name: n, icon: `/assets/icons/${icon}.png` });
    }
    this.categories.sort((a, b) =>
      a.name > b.name ? 1 : b.name > a.name ? -1 : 0
    );
  }

  closeFilters(): void {
    this.categories = [];
    this.visibleFilters = false;
  }

  onSelect(catName: string) {
    const index = this.selectedCategories.indexOf(catName);
    if (index > -1) {
      this.selectedCategories.splice(index, 1);
    } else {
      this.selectedCategories.push(catName);
    }
  }

  apply() {
    this.loadingMore = false;
    this.app.showSpinner();
    this.closeFilters();
    let email;
    this.app.userEmail.subscribe((m) => (email = m));
    const data = {
      email: email,
      categories: this.selectedCategories,
      min: this.amountRange ? this.amountRange[0] : null,
      max: this.amountRange ? this.amountRange[1] : null,
    };
    this.app.getFilterTxn(data).subscribe((data) => {
      if (data) {
        this.app.hideSpinner();
        this.allTransactions = data as any[];
        this.showDot = true;
        this.message = 'No matching data found';
      }
    });
  }

  clear() {
    this.showDot = false;
    this.loadingMore = true;
    this.selectedCategories = [];
    this.amountRange = [];
    this.getTransactions();
  }

  openSort() {
    this.visibleSorting = true;
  }

  closeSort() {
    this.visibleSorting = false;
  }

  formatter(value: number): string {
    if (this.currency != undefined) {
      return `${this.currency} ${value}`;
    }
    return `${value}`;
  }

  sort() {
    let sortedlist = [];
    switch (this.sortingType) {
      case 'date-asc':
        sortedlist = this.allTransactions.sort((a: any, b: any) => {
          return new Date(a.data.date) > new Date(b.data.date) ? -1 : 1;
        });
        break;

      case 'date-desc':
        sortedlist = this.allTransactions.sort((a: any, b: any) => {
          return new Date(a.data.date) > new Date(b.data.date) ? 1 : -1;
        });
        break;

      case 'name-asc':
        sortedlist = this.allTransactions.sort((a: any, b: any) => {
          return a.data.title.toLowerCase() > b.data.title.toLowerCase()
            ? 1
            : -1;
        });
        break;

      case 'name-desc':
        sortedlist = this.allTransactions.sort((a: any, b: any) => {
          return a.data.title.toLowerCase() > b.data.title.toLowerCase()
            ? -1
            : 1;
        });
        break;

      case 'amount-asc':
        sortedlist = this.allTransactions.sort((a: any, b: any) => {
          return a.data.amount > b.data.amount ? -1 : 1;
        });
        break;

      case 'amount-desc':
        sortedlist = this.allTransactions.sort((a: any, b: any) => {
          return a.data.amount > b.data.amount ? 1 : -1;
        });
        break;
    }
    this.allTransactions = sortedlist;
    this.closeSort();
  }
}
