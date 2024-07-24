import { Router } from '@angular/router';
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
  globalList: any[] = [];
  allTransactions!: any[];
  categories: any[] = [];
  sortingType = 'date-asc';
  visibleFilters = false;
  visibleSorting = false;
  showDot = false;
  currency = this.app.currency$;
  selectedCat: string = '';
  amountRange!: any[];
  highestAmount!: number;

  pageNumber: number = 1;
  loadingMore = false;

  constructor(private app: AppService, private router: Router) {}

  ngOnInit() {
    this.getTransactions();
  }

  onLoadMore() {
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
      .subscribe((data) => {
        if (data) {
          this.app.hideSpinner();
          if (this.pageNumber > 1) {
            this.allTransactions = this.allTransactions.concat(data);
          } else {
            this.allTransactions = data as any[];
          }
          this.loadingMore = true;
          if (this.allTransactions.length > 0) {
            this.sort();
            let highestAmount = Math.max(
              ...this.allTransactions.map(
                (transaction) => transaction.data.amount
              )
            );
            console.log(highestAmount);
            this.highestAmount = highestAmount;
            this.amountRange = [0, highestAmount];
            this.globalList = this.allTransactions;
          }
        }
      });
  }

  getIcon(category: string): string {
    if (category in CAT_ICON) {
      const icon = CAT_ICON[category as keyof typeof CAT_ICON];
      return `/assets/icons/${icon}.png`;
    }
    return 'NA';
  }

  onTxn(txnId: string) {
    this.router.navigate(['edit', txnId]);
  }

  openFilters(): void {
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
    this.selectedCat = catName;
  }

  apply() {
    this.loadingMore = false;
    this.closeFilters();
    if (this.selectedCat) {
      this.allTransactions = this.allTransactions.filter(
        (transaction: any) => transaction.data.category === this.selectedCat
      );
      this.showDot = true;
    }

    if (this.amountRange.length > 0) {
      this.allTransactions = this.allTransactions.filter(
        (transaction: any) =>
          transaction.data.amount >= this.amountRange[0] &&
          transaction.data.amount <= this.amountRange[1]
      );
      this.showDot = true;
    }
  }

  clear() {
    this.selectedCat = '';
    this.showDot = false;
    this.loadingMore = true;
    this.amountRange = [0, this.highestAmount];
    this.allTransactions = this.globalList;
  }

  openSort() {
    this.visibleSorting = true;
  }

  closeSort() {
    this.visibleSorting = false;
  }

  formatter(value: number): string {
    return `₹ ${value}`;
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
