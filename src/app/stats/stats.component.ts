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
  public chartColors: any[] = [
    {
      backgroundColor: ['#FF7360', '#6FC8CE', '#FAFFF2', '#FFFCC4', '#B9E8E0'],
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
            const { categories, amounts } =
              this.getCategoriesAndAmounts(output);
            console.log('Categories:', categories);
            console.log('Amounts:', amounts);
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

  getCategoriesAndAmounts(transactions: any[]): {
    categories: string[];
    amounts: number[];
  } {
    const categorySum = this.sumAmountByCategory(transactions);
    const categories: string[] = [];
    const amounts: number[] = [];

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
    return { categories, amounts };
  }
}
