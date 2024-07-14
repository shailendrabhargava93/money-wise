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
  public pieChartOptions: ChartOptions<'doughnut'> = {
    responsive: false,
    plugins: { legend: { display: false } },
  };
  public pieChartLabels: any[] = [];
  public pieChartDatasets: any[] = [
    {
      data: [],
    },
  ];

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
      const moddate = transaction.data.date;
      const amount = transaction.data.amount;

      if (moddate in dateSum) {
        dateSum[moddate] += amount;
      } else {
        dateSum[moddate] = amount;
      }
    }

    const sortedKeys = Object.keys(dateSum).sort();
    let sortedData: { [key: string]: number } = {};
    for (let key of sortedKeys) {
      sortedData[key] = dateSum[key];
    }

    return sortedData;
  }

  getCategoriesAndAmounts(transactions: any[]) {
    const categorySum = this.sumAmountByCategory(transactions);
    const dateSum = this.sumAmountByDate(transactions);

    console.log(categorySum, dateSum);

    const categories: string[] = [];
    const amounts: number[] = [];

    const dates: string[] = [];
    let dateAmounts: number[] = [];

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
        backgroundColor: this.colorScheme.slice(0, amounts.length),
        borderColor: this.colorScheme.slice(0, amounts.length),
        hoverBackgroundColor: this.colorScheme.slice(0, amounts.length),
        hoverBorderColor: this.colorScheme.slice(0, amounts.length),
        hoverOffset: 15,
      },
    ];

    for (const date in dateSum) {
      if (dateSum.hasOwnProperty(date)) {
        const formattedDate = new Date(date).toLocaleDateString('en-US', {
          day: '2-digit',
          month: 'short',
        });
        dates.push(formattedDate);
        dateAmounts.push(dateSum[date]);
      }
    }

    this.chartLabels = dates;
    this.chartData = [
      {
        data: dateAmounts.map((el) => el),
        label: 'Amount',
      },
    ];
  }

  colorScheme = [
    '#FEA47F',
    '#25CCF7',
    '#EAB543',
    '#FC427B',
    '#20bf6b',
    '#3B3B98',
    '#82589F',
    '#55E6C1',
    '#B33771',
    '#D6A2E8',
    '#BDC581',
    '#0fb9b1',
    '#ea8685',
    '#9AECDB',
  ];
}
