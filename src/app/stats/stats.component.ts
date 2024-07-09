import { switchMap, catchError, of } from 'rxjs';
import { AppService } from './../app.service';
import { Component, OnInit } from '@angular/core';
import { ChartOptions } from 'chart.js';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css'],
})
export class StatsComponent implements OnInit {
  // Pie
  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: false,
    plugins: { legend: { position: 'bottom' } },
  };
  public pieChartLabels: any[] = [];
  public pieChartDatasets: any[] = [
    {
      data: [],
    },
  ];
  public pieChartLegend = true;
  public pieChartPlugins = [];

  //bar
  public chartType: string = 'line';
  public chartLabels: string[] = [];
  public chartData: any[] = [
    {
      data: [],
    },
  ];

  constructor(private app: AppService) {}
  ngOnInit(): void {
    this.app.userEmail
      .pipe(
        switchMap((user) => this.app.getTransactions(user as string)),
        catchError((error) => {
          console.error('Error occurred getTransactions:', error);
          return of([]);
        })
      )
      .subscribe((data) => {
        if (data) {
          const output = data as any[];
          if (output.length > 0) {
            this.getCategoriesAndAmounts(output);
          }
        }
      });
  }

  sumAmountByCategory(transactions: any[]): Record<string, number> {
    const categorySum: Record<string, number> = {};

    for (const transaction of transactions) {
      const category = transaction.data.category;
      const amount = transaction.data.amount;

      if (category in categorySum) {
        categorySum[category] += amount;
      } else {
        categorySum[category] = amount;
      }
    }

    return categorySum;
  }

  sumAmountByDate(transactions: any[]): Record<string, number> {
    const dateSum: Record<string, number> = {};

    for (const transaction of transactions) {
      const moddate = new Date(transaction.data.date);

      const formattedDate = moddate.toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
      });

      console.log(formattedDate);
      const amount = transaction.data.amount;

      if (formattedDate in dateSum) {
        dateSum[formattedDate] += amount;
      } else {
        dateSum[formattedDate] = amount;
      }
    }

    return dateSum;
  }

  getCategoriesAndAmounts(transactions: any[]) {
    const categorySum = this.sumAmountByCategory(transactions);
    const dateSum = this.sumAmountByDate(transactions);

    const categories: string[] = [];
    const amounts: number[] = [];

    const dates: string[] = [];
    const dateAmounts: number[] = [];

    for (const category in categorySum) {
      if (categorySum.hasOwnProperty(category)) {
        categories.push(category);
        amounts.push(categorySum[category]);
      }
    }
    this.pieChartLabels = categories;
    this.pieChartDatasets = [
      {
        data: amounts.map((el) => el),
      },
    ];

    for (const date in dateSum) {
      if (dateSum.hasOwnProperty(date)) {
        dates.push(date);
        dateAmounts.push(dateSum[date]);
      }
    }

    this.chartLabels = dates.sort();
    this.chartData = [
      {
        data: dateAmounts.map((el) => el),
        label: 'Amount',
      },
    ];
  }
}
