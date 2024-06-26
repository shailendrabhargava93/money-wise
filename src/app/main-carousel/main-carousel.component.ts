import { Component } from '@angular/core';

@Component({
  selector: 'app-main-carousel',
  templateUrl: './main-carousel.component.html',
  styleUrls: ['./main-carousel.component.css'],
})
export class MainCarouselComponent {
  array = [
    {
      heading: 'Manage your expenses wisely',
      image: 'assets/slider/Wallet-pana.svg',
    },
    {
      heading: 'Setup budgets and share with family',
      image: 'assets/slider/Data-report-pana.svg',
    },
    {
      heading: 'Analyse and understand your finances',
      image: 'assets/slider/Business-Plan-pana.svg',
    },
    {
      heading: 'Get detailed charts and reports',
      image: 'assets/slider/Spreadsheets-pana.svg',
    },
  ];
}
