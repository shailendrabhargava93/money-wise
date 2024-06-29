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
            const txns: any[] = [];
            output.forEach((el: any) => {
              txns.push({ category: el.data.category, amount: el.data.amount });
              this.pieChartLabels.push(el.data.category);
            });
            this.pieChartDatasets = [
              {
                data: txns.map((el) => el.amount),
              },
            ];
          }
        }
      });
  }
  // Pie
  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: false,
    plugins: { legend: { position: 'right' } },
  };
  public pieChartLabels: any[] = [];
  public pieChartDatasets: any[] = [
    {
      data: [],
    },
  ];
  public pieChartLegend = true;
  public pieChartPlugins = [];
}
