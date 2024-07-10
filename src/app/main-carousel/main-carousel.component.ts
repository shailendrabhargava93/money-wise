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
      heading: 'Welcome to Money Wise',
      subheading:
        'Track control of your money by tracking your spending habits wisely',
      image: 'assets/slider/Wallet-pana.svg',
    },
    {
      heading: 'Save Money with ease',
      subheading:
        'Plan wisely with budgets, share and manage them with family or partner',
      image: 'assets/slider/Growth-analytics-pana.svg',
    },
    {
      heading: 'Analyse your all finances',
      subheading:
        'Keep an eye on your progress, track it, and get the hang of the numbers',
      image: 'assets/slider/Business-Plan-pana.svg',
    },
    {
      heading: 'Improve your saving habits',
      subheading:
        'Boost your financial independence by leveling up your savings habit..',
      image: 'assets/slider/Investing-pana.svg',
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
