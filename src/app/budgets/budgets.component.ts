import { AppService } from './../app.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-budgets',
  templateUrl: './budgets.component.html',
  styleUrls: ['./budgets.component.css'],
})
export class BudgetsComponent implements OnInit {
  budgets!: any[];
  constructor(private app: AppService) {}

  ngOnInit() {
    this.app.showSpinner();
    this.app.getBudgets().subscribe((data) => {
      if (data) {
        this.app.hideSpinner();
        this.budgets = data as any;
      }
    });
  }
}
