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
  allTransactions!: any[];
  categories: any[] = [];
  sortDirection = 'asc';
  visible = false;

  constructor(private app: AppService, private router: Router) {}

  ngOnInit() {
    this.getTransactions();
  }

  private getTransactions() {
    this.app.showSpinner();
    this.app.userEmail
      .pipe(
        switchMap((user) => this.app.getTransactions(user as string)),
        catchError((error) => {
          console.error('Error occurred getTransactions:', error);
          this.app.hideSpinner();
          return of([]);
        })
      )
      .subscribe((data) => {
        if (data) {
          this.app.hideSpinner();
          this.allTransactions = data as any[];
          if (this.allTransactions.length > 0) {
            this.sort();
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

  sort() {
    this.app.showSpinner();
    if (this.sortDirection === 'asc') {
      this.allTransactions = this.allTransactions.sort((a: any, b: any) => {
        //asc sorting
        return new Date(a.data.date) > new Date(b.data.date) ? -1 : 1;
      });
      this.sortDirection = 'desc';
    } else {
      this.allTransactions = this.allTransactions.sort((a: any, b: any) => {
        //desc sorting
        return new Date(a.data.date) > new Date(b.data.date) ? 1 : -1;
      });
      this.sortDirection = 'asc';
    }
    this.app.hideSpinner();
    this.close();
  }

  onTxn(txnId: string) {
    this.router.navigate(['edit', txnId]);
  }

  open(): void {
    this.visible = true;
    for (var n in CAT_ICON) {
      const icon = CAT_ICON[n as keyof typeof CAT_ICON];
      this.categories.push({ name: n, icon: `/assets/icons/${icon}.png` });
    }
    this.categories.sort((a, b) =>
      a.name > b.name ? 1 : b.name > a.name ? -1 : 0
    );
  }

  close(): void {
    this.categories = [];
    this.visible = false;
  }

  selectedCat: string = '';
  onSelect(catName: string) {
    this.selectedCat = catName;
  }

  showDot = false;
  apply() {
    this.close();
    if (this.selectedCat) {
      this.allTransactions = this.allTransactions.filter(
        (transaction: any) => transaction.data.category === this.selectedCat
      );
      this.showDot = true;
    }
  }

  clear() {
    this.selectedCat = '';
    this.showDot = false;
    this.getTransactions();
  }
}
