import { Router } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'app-main-carousel',
  templateUrl: './main-carousel.component.html',
  styleUrls: ['./main-carousel.component.css'],
})
export class MainCarouselComponent {
  array = [
    {
      heading: 'Track your spending habits wisely',
      image: 'assets/slider/Wallet-pana.svg',
    },
    {
      heading: 'Share budgets and manage with family or partner',
      image: 'assets/slider/Data-report-pana.svg',
    },
    {
      heading: 'Analyse and understand your finances',
      image: 'assets/slider/Business-Plan-pana.svg',
    },
    {
      heading: 'Improve your saving habits',
      image: 'assets/slider/Spreadsheets-pana.svg',
    },
  ];

  constructor(private router: Router) {
    const token = localStorage.getItem('user');
    if (token != null) {
      this.router.navigate(['home']);
    } else {
      localStorage.clear();
    }
  }
}
