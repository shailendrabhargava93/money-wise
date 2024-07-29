import { AppService } from './../app.service';
import { Component, Input, OnInit } from '@angular/core';
import { ChartOptions } from 'chart.js';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css'],
})
export class StatsComponent implements OnInit {
  @Input() budgetId!: string;

  // Doughnut
  public doughnutChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    aspectRatio: 1,
    cutout: '50%',
    animation: {
      animateRotate: false,
    },
  };
  public doughnutChartLabels: any[] = [];
  public doughnutChartDatasets: any[] = [];

  //bar
  public barChartOptions = {
    responsive: true,
    aspectRatio: 1,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
  public barChartLabels: string[] = [];
  public barChartData: any[] = [];

  constructor(private app: AppService) {}
  ngOnInit(): void {
    this.app.getStats(this.budgetId).subscribe((data) => {
      if (data) {
        this.formatDataForCharts(data);
      }
    });
  }

  formatDataForCharts(data: any) {
    const categorySum = data.categoryData;
    const dateSum = data.datesData;

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
    this.doughnutChartLabels = categories;
    this.doughnutChartDatasets = [
      {
        data: amounts.map((el) => el),
        backgroundColor: this.colorScheme.slice(0, amounts.length),
        borderColor: 'white',
        hoverBackgroundColor: this.colorScheme.slice(0, amounts.length),
        hoverBorderColor: 'white',
        hoverOffset: 5,
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

    this.barChartLabels = dates;
    this.barChartData = [
      {
        data: dateAmounts.map((el) => el),
        label: 'Amount',
        backgroundColor: this.colorScheme.slice(0, amounts.length),
        borderColor: 'white',
        hoverBackgroundColor: this.colorScheme.slice(0, amounts.length),
        hoverBorderColor: 'white',
      },
    ];
  }

  colorScheme = [
    '#003f5c',
    '#de425b',
    '#2f4b7c',
    '#ff7c43',
    '#d45087',
    '#665191',
    '#a05195',
    '#f95d6a',
    '#ffa600',
  ];
}
