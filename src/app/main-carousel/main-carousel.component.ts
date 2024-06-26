import { Component } from '@angular/core';

@Component({
  selector: 'app-main-carousel',
  templateUrl: './main-carousel.component.html',
  styleUrls: ['./main-carousel.component.css'],
})
export class MainCarouselComponent {
  array = [
    {
      text: 'text1',
      image: 'assets/slider/Revenue-pana.svg',
    },
    {
      text: 'text1',
      image: 'assets/slider/Manage-money-pana.svg',
    },
    {
      text: 'text3',
      image: 'assets/slider/Data-report-pana.svg',
    },
    {
      text: 'text4',
      image: 'assets/slider/Business-Plan-pana.svg',
    },
  ];
}
