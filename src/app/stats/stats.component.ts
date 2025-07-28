import { AppService } from './../app.service';
import { Component, Input, OnInit } from '@angular/core';
import { ChartOptions } from 'chart.js';
import { CATEGORIES } from '../category-config';

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
  labelListData: { label: string; sum: number; count: number }[] = [];
  selectedWeek = '';
  index = 0;
  allWeeks: string[] = [];
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

  public barChartOptions = {
    responsive: true,
    aspectRatio: 1,
    scales: {
      x: {
        grid: {
          display: false, // ❌ removes vertical grid lines
        },
        ticks: {
          maxRotation: 0,
          minRotation: 0,
        },
        // Adjust bar thickness
        barPercentage: 0.4, // controls individual bar width
        categoryPercentage: 0.5, // controls category (group) width
      },
      y: {
        beginAtZero: true,
        grid: {
          display: false, // ❌ removes horizontal grid lines
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
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
    // Get current year
    const currentYear = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    const weekCount = this.getTotalWeeksInMonth(currentYear, month);
    if (weekCount > 0) {
      for (let i = 1; i <= weekCount; i++) {
        this.allWeeks.push(`Week ${i}`);
      }
    }
  }

  formatDataForCharts(data: any) {
    const categorySum = data.categoryTxnCount;
    const labelsSumData = data.labelTxnCount;
    const dateSum = data.datesData;

    const categories: string[] = [];
    const categoriesBgColor: string[] = [];
    const amounts: number[] = [];

    // Create an array of category objects
    const categoryArray = [];
    for (const category in categorySum) {
      if (categorySum.hasOwnProperty(category)) {
        categoryArray.push({
          category: category,
          sum: categorySum[category].sumAmount,
          count: categorySum[category].count,
        });
      }
    }

    // Sort categories by sumAmount in descending order
    categoryArray.sort((a, b) => b.sum - a.sum);

    // Get top 5 categories
    const topCategories = categoryArray.slice(0, 5);

    for (const category of topCategories) {
      this.categoryListData.push(category);
      categories.push(category.category);
      amounts.push(category.sum);
      const categoryObj = CATEGORIES.find(cat => cat.name === category.category);
      let bgColor = '#cccccc';
      if (categoryObj) {
        bgColor = categoryObj.textColor || bgColor;
      }
      categoriesBgColor.push(bgColor);
    }

    for (const label in labelsSumData) {
      if (labelsSumData.hasOwnProperty(label)) {
        this.labelListData.push({
          label: label,
          sum: labelsSumData[label].sumAmount,
          count: labelsSumData[label].count,
        });
      }
    }

    this.doughnutChartLabels = categories;
    this.doughnutChartDatasets = [
      {
        data: amounts.map((el) => el),
        backgroundColor: categoriesBgColor,
        borderColor: 'white',
        hoverBackgroundColor: categoriesBgColor,
        hoverBorderColor: 'white',
        hoverOffset: 5,
      },
    ];

    const weeklyData = this.groupDataByWeek(dateSum);
    this.weeklyData = weeklyData;
    this.selectedWeek = this.getWeekNumber(new Date());
    this.onClick(this.selectedWeek);
  }

  onClick(week: string) {
    const index: number = this.selectedWeek.split(
      'Week '
    )[1] as unknown as number;
    this.index = index - 1;
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
        backgroundColor: '#4f46e5',
        borderColor: 'white',
        hoverBackgroundColor: '#4f46e5',
        hoverBorderColor: 'white',
        barThickness: 15,
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

  getTotalWeeksInMonth(year: number, month: number): number {
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const firstDayOfWeek = firstDay.getDay();
    const lastDate = lastDay.getDate();

    let totalDays = lastDate + firstDayOfWeek;
    if (totalDays % 7 === 0) {
      return totalDays / 7;
    } else {
      return Math.ceil(totalDays / 7);
    }
  }
}
