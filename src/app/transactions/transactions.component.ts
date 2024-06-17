import { CAT_ICON } from './../category-icons';
import { AppService } from './../app.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css'],
})
export class TransactionsComponent implements OnInit {
  constructor(private app: AppService) {}

  allTransactions: any[] = [];
  ngOnInit() {
    this.app.getTransactions().subscribe((data) => {
      if (data) {
        this.allTransactions = data as any;
        if (this.allTransactions) {
          this.allTransactions.sort((a: any, b: any) => {
            //asc sorting
            return new Date(a.data.date) > new Date(b.data.date) ? -1 : 1;
          });
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
}
