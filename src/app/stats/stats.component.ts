import { AppService } from './../app.service';
import { Component, Input, OnInit } from '@angular/core';
import { ChartOptions } from 'chart.js';

export class WeeklyData {
  [key: string]: { [date: string]: number };
}

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css'],
})
export class StatsComponent implements OnInit {
  @Input() budgetId!: string;
  categoryListData: { category: string; sum: number; count: number }[] = [];
  selectedWeek = 'Week 1';
  weeklyData: any;

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
    const categorySum = data.categoryTxnCount;
    const dateSum = data.datesData;

    const categories: string[] = [];
    const amounts: number[] = [];

    for (const category in categorySum) {
      if (categorySum.hasOwnProperty(category)) {
        this.categoryListData.push({
          category: category,
          sum: categorySum[category].sumAmount,
          count: categorySum[category].count,
        });
        categories.push(category);
        amounts.push(categorySum[category].sumAmount);
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

    const weeklyData = this.groupDataByWeek(dateSum);
    console.log(weeklyData);
    this.weeklyData = weeklyData;

    this.onClick(this.selectedWeek);
  }

  onClick(week: string) {
    this.selectedWeek = week;
    const selectedWeekData = this.weeklyData[this.selectedWeek];
    this.onWeekSelect(selectedWeekData);
  }

  onWeekSelect(selectedWeekData: any) {
    const dates: string[] = [];
    let dateAmounts: number[] = [];
    for (const date in selectedWeekData) {
      if (selectedWeekData.hasOwnProperty(date)) {
        const formattedDate = new Date(date).toLocaleDateString('en-US', {
          day: '2-digit',
          month: 'short',
        });
        dates.push(formattedDate);
        dateAmounts.push(selectedWeekData[date]);
      }
    }

    this.barChartLabels = dates;
    this.barChartData = [
      {
        data: dateAmounts.map((el) => el),
        label: 'Amount',
        backgroundColor: this.colorScheme.slice(0, dateAmounts.length),
        borderColor: 'white',
        hoverBackgroundColor: this.colorScheme.slice(0, dateAmounts.length),
        hoverBorderColor: 'white',
      },
    ];
  }

  groupDataByWeek(data: { [date: string]: number }): WeeklyData {
    const weeklyData: WeeklyData = {};

    for (const date in data) {
      const week = this.getWeekNumber(new Date(date));
      if (!weeklyData[week]) {
        weeklyData[week] = {};
      }
      weeklyData[week][date] = data[date];
    }

    return weeklyData;
  }

  getWeekNumber(d: Date): string {
    const startOfMonth = new Date(d.getFullYear(), d.getMonth(), 1);
    const weekOfMonth =
      Math.floor((d.getDate() + startOfMonth.getDay() - 1) / 7) + 1;
    return `Week ${weekOfMonth}`;
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
