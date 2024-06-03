import { AppService } from './../app.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css'],
})
export class TransactionsComponent implements OnInit {
  constructor(private app: AppService) {}
  loading = true;

  allTransactions: any[] = [];
  ngOnInit() {
    this.app.getTransactions().subscribe((data) => {
      if (data) {
        this.loading = false;
        this.allTransactions = data as any;
      }
    });
  }
}
