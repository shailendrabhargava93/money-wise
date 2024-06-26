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
  isAscSorted = true;
  constructor(private app: AppService, private router: Router) {}

  ngOnInit() {
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
            this.sort('asc');
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

  sort(direction: string) {
    this.app.showSpinner();
    if (direction === 'asc') {
      this.isAscSorted = true;
      this.allTransactions = this.allTransactions.sort((a: any, b: any) => {
        //asc sorting
        return new Date(a.data.date) > new Date(b.data.date) ? -1 : 1;
      });
    } else {
      this.isAscSorted = false;
      this.allTransactions = this.allTransactions.sort((a: any, b: any) => {
        //dsc sorting
        return new Date(a.data.date) > new Date(b.data.date) ? 1 : -1;
      });
    }
    this.app.hideSpinner();
  }

  onTxn(txnId: string) {
    this.router.navigate(['edit', txnId])
  }
}
