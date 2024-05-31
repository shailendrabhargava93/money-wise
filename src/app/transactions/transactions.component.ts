import { AppService } from './../app.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css'],
})
export class TransactionsComponent implements OnInit {
  constructor(private api: AppService) {}
  loading = true;
  allTransactions: any[] = [];
  ngOnInit() {
    this.api.getTransactions().subscribe((data) => {
      if (data) {
        this.loading = false;
        console.log(data);
        this.allTransactions = data as any;
      }
    });
  }
}
