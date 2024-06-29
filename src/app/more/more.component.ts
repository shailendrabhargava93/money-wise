import { AppService } from './../app.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-more',
  templateUrl: './more.component.html',
  styleUrls: ['./more.component.css'],
})
export class MoreComponent implements OnInit {
  constructor(private app: AppService) {}
  currencies: any[] = [];
  panels = [
    {
      name: 'Currency',
    },
    {
      name: 'Categories',
    },
    {
      name: 'Accounts',
    },
  ];

  ngOnInit(): void {
    // this.app.getCurrencyList().subscribe((data: any) => {
    //   if (data) {
    //     this.currencies = data.data;
    //   }
    // });
  }
}
